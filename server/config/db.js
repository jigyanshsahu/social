// db.js
import pg from 'pg';
const { Pool } = pg;

// Use environment variables for sensitive database credentials
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'my_app_db',
  password: process.env.DB_PASSWORD || 'surholi@123',
  port: process.env.DB_PORT || 5432,
});

export default pool;