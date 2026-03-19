const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

console.log("=== Database Config ===");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "***" : "not set");
console.log("====================");

let pool;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if available
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else if (process.env.DB_HOST) {
  // Use individual env vars
  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'railway',
    ssl: { rejectUnauthorized: false },
  });
} else {
  // Local fallback
  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'yearbook_db',
    password: 'password',
    port: 5432,
  });
}

module.exports = pool;
