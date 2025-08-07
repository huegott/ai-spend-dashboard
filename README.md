# AI Spend Dashboard

A comprehensive web application for tracking and visualizing AI API usage and costs from OpenAI and Anthropic providers.

## Features

- **Real-time Spend Tracking**: Monitor your AI API costs across providers
- **Interactive Visualizations**: Charts and graphs for spend analysis
- **Provider Comparison**: Compare costs between OpenAI and Anthropic
- **Model Breakdown**: Detailed analysis by AI model
- **Data Filtering**: Filter by date ranges, providers, models, and projects
- **MCP Integrations**: Integration with Portainer, GitHub, n8n, and Asana (Phase 3)
- **Docker Deployment**: Containerized for easy deployment

## Architecture

- **Frontend**: React with TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Deployment**: Docker Compose with HTTPS support

## Quick Start

### Prerequisites

- Docker and Docker Compose
- OpenAI API key (optional)
- Anthropic API key (optional)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ai-spend-dashboard
```

### 2. Configure Secrets

Create the required secret files:

```bash
# Database password
echo "your_secure_password" > secrets/db_password.txt

# API keys (optional - add if you want automatic syncing)
echo "sk-your-openai-key" > secrets/openai_api_key.txt
echo "your-anthropic-key" > secrets/anthropic_api_key.txt
```

### 3. SSL Certificates (Production)

For HTTPS deployment at https://10.10.10.20:9443, place your SSL certificates in the `ssl/` directory:

```bash
# Copy your certificates
cp your-cert.pem ssl/cert.pem
cp your-private-key.pem ssl/privkey.pem

# Set proper permissions
chmod 600 ssl/privkey.pem
chmod 644 ssl/cert.pem
```

For testing with self-signed certificates:

```bash
openssl req -x509 -newkey rsa:4096 -keyout ssl/privkey.pem -out ssl/cert.pem -days 365 -nodes
```

### 4. Deploy

```bash
# Build and start the application
docker-compose up -d

# Check logs
docker-compose logs -f
```

The application will be available at:
- **Production**: https://10.10.10.20:9443
- **Development**: http://localhost:3000

## Usage

### Initial Setup

1. Access the dashboard in your web browser
2. Use the "Sync OpenAI" button to pull your OpenAI usage data
3. For Anthropic data, use the manual input feature or bulk import

### Data Syncing

- **OpenAI**: Automatic syncing via API (requires API key)
- **Anthropic**: Manual input or CSV bulk import (API limitations)

### Filtering and Analysis

- Use date range filters to analyze specific time periods
- Filter by provider (OpenAI, Anthropic, or All)
- View breakdowns by model, project, and API key
- Export data for external analysis

## API Endpoints

### Dashboard Data
- `GET /api/dashboard/summary` - Summary statistics
- `GET /api/spend` - Detailed spend data with filters

### Data Management
- `POST /api/spend/sync/openai` - Sync OpenAI data
- `POST /api/spend/anthropic/manual` - Add Anthropic data manually
- `POST /api/spend/manual/bulk` - Bulk data import

### MCP Integrations (Phase 3)
- `GET /api/mcp/integrations` - MCP integration status
- `GET /api/mcp/tasks` - Tasks from integrated systems

## Development

### Local Development

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install

# Start development servers
npm run dev
```

### Project Structure

```
├── server/                 # Backend Express.js application
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic (OpenAI, Anthropic)
│   ├── models/            # Database models and queries
│   └── migrations/        # Database schema
├── client/                # Frontend React application
│   ├── src/components/    # React components
│   ├── src/hooks/         # Custom React hooks
│   ├── src/services/      # API client services
│   └── src/types/         # TypeScript type definitions
├── secrets/               # API keys and secrets
├── ssl/                   # SSL certificates
└── docker-compose.yml     # Docker deployment configuration
```

## Environment Variables

Key environment variables (see `.env.example`):

```bash
# Database
DATABASE_URL=postgresql://dashboard:password@postgres:5432/ai_spend

# API Keys
OPENAI_API_KEY=sk-your-key
ANTHROPIC_API_KEY=your-key

# Application
NODE_ENV=production
PORT=3000
```

## Security

- API keys stored as Docker secrets
- HTTPS encryption in production
- Database credentials secured
- Rate limiting on API endpoints
- Input validation and sanitization

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL container is running
   - Verify database credentials in secrets

2. **API Sync Errors**
   - Verify API keys are correct and active
   - Check API rate limits
   - Review server logs for detailed errors

3. **HTTPS Certificate Issues**
   - Ensure certificates are properly placed in `ssl/` directory
   - Check certificate validity and permissions
   - Verify domain matches certificate

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs ai-dashboard
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the logs for error details
3. Open an issue on GitHub

## Roadmap

### Phase 1 (Completed)
- ✅ Core dashboard with spend visualization
- ✅ OpenAI API integration
- ✅ Basic filtering and date ranges

### Phase 2 (In Progress)
- ✅ Enhanced visualizations
- ✅ Anthropic manual data input
- ✅ Docker deployment with PostgreSQL

### Phase 3 (Planned)
- 🔄 MCP integrations (Portainer, GitHub, n8n, Asana)
- 🔄 Advanced analytics and forecasting
- 🔄 Automated alerting and budgets