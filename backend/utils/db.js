const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Optimasi Pooling
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // Diperbesar untuk Neon DB cold start
});

module.exports = pool;
