const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
require('dotenv').config();

const { initializeDatabase } = require('./models/database');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const spendRoutes = require('./routes/spend');
const mcpRoutes = require('./routes/mcp');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: NODE_ENV === 'production' ? ['https://10.10.10.20:9443'] : true,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/spend', spendRoutes);
app.use('/api/mcp', mcpRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV
  });
});

// Serve static files in production
if (NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    
    // Handle client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  
  res.status(error.status || 500).json({
    error: NODE_ENV === 'production' ? 'Internal server error' : error.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully');

    // SSL configuration for production
    if (NODE_ENV === 'production' && fs.existsSync('/app/ssl/privkey.pem') && fs.existsSync('/app/ssl/cert.pem')) {
      const options = {
        key: fs.readFileSync('/app/ssl/privkey.pem'),
        cert: fs.readFileSync('/app/ssl/cert.pem')
      };

      https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 AI Spend Dashboard running on HTTPS port ${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
      });
    } else {
      // HTTP for development
      http.createServer(app).listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 AI Spend Dashboard running on HTTP port ${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

startServer();