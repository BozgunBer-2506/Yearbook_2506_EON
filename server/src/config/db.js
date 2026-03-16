const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'db', // 'db' is the service name in docker-compose
  database: process.env.DB_NAME || 'yearbook_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
