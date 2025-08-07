const { Pool } = require('pg');
const fs = require('fs');

let pool;

// Initialize database connection
function initializePool() {
  if (pool) return pool;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return pool;
}

// Get database pool
function getPool() {
  if (!pool) {
    initializePool();
  }
  return pool;
}

// Execute query
async function query(text, params = []) {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Transaction wrapper
async function transaction(callback) {
  const client = await getPool().connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Initialize database schema
async function initializeDatabase() {
  try {
    const pool = getPool();
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('Database connection established');

    // Check if tables exist, if not, create them
    const tablesExist = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'spend_data'
      );
    `);

    if (!tablesExist.rows[0].exists) {
      console.log('Creating database schema...');
      const initScript = fs.readFileSync(__dirname + '/../migrations/init.sql', 'utf8');
      await pool.query(initScript);
      console.log('Database schema created successfully');
    } else {
      console.log('Database schema already exists');
    }

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Close database connection
async function closeDatabase() {
  if (pool) {
    await pool.end();
    console.log('Database connection closed');
  }
}

module.exports = {
  query,
  transaction,
  initializeDatabase,
  closeDatabase,
  getPool
};