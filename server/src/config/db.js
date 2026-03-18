const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from server folder
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

let pool;

// Use individual env vars for Railway
if (process.env.DB_HOST) {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 53800,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'railway',
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // Local fallback
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
