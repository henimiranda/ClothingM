const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all inventory logs
router.get('/logs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT il.*, p.name as product_name 
      FROM inventory_logs il 
      JOIN products p ON il.product_id = p.id 
      ORDER BY il.timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add inventory log (Stock In/Out)
router.post('/logs', async (req, res) => {
  const { product_id, type, quantity, reason } = req.body;
  try {
    // 1. Insert log
    const newLog = await pool.query(
      'INSERT INTO inventory_logs (product_id, type, quantity, reason) VALUES ($1, $2, $3, $4) RETURNING *',
      [product_id, type, quantity, reason]
    );

    // 2. Update product base_stock
    const updateQuery = type === 'IN' 
      ? 'UPDATE products SET base_stock = base_stock + $1 WHERE id = $2'
      : 'UPDATE products SET base_stock = base_stock - $1 WHERE id = $2';
    
    await pool.query(updateQuery, [quantity, product_id]);

    res.status(201).json(newLog.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
