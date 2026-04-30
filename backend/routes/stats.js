const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get overview statistics
router.get('/overview', async (req, res) => {
  try {
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    const userCount = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'customer'");
    const totalStock = await pool.query('SELECT SUM(base_stock) FROM products');
    const recentLogs = await pool.query(`
      SELECT il.*, p.name as product_name 
      FROM inventory_logs il 
      JOIN products p ON il.product_id = p.id 
      ORDER BY il.timestamp DESC LIMIT 5
    `);

    res.json({
      totalProducts: parseInt(productCount.rows[0].count),
      totalUsers: parseInt(userCount.rows[0].count),
      totalStock: parseInt(totalStock.rows[0].sum) || 0,
      recentLogs: recentLogs.rows,
      revenue: 12500000 // Dummy revenue for now since we haven't linked real payments
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
