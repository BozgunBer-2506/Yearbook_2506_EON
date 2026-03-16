const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let pool;

// Railway provides DATABASE_URL as a single connection string
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Railway PostgreSQL
    },
  });
} else {
  // Local development fallback (docker-compose)
  pool = new Pool({
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME || 'yearbook_db',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT) || 5432,
  });
}

module.exports = {
  query: (text, params) => pool.query(text, params),
};
