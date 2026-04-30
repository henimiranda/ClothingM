const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all production orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT po.*, p.name as product_name 
      FROM production_orders po 
      JOIN products p ON po.product_id = p.id 
      ORDER BY po.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create production order
router.post('/', async (req, res) => {
  const { product_id, quantity, start_date, end_date } = req.body;
  try {
    const newOrder = await pool.query(
      'INSERT INTO production_orders (product_id, quantity, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [product_id, quantity, start_date, end_date, 'queued']
    );
    res.status(201).json(newOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update production status
router.put('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const updatedOrder = await pool.query(
      'UPDATE production_orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    // If completed, automatically add to inventory
    if (status === 'completed') {
      const order = updatedOrder.rows[0];
      await pool.query(
        'INSERT INTO inventory_logs (product_id, type, quantity, reason) VALUES ($1, $2, $3, $4)',
        [order.product_id, 'IN', order.quantity, 'production completed']
      );
      await pool.query(
        'UPDATE products SET base_stock = base_stock + $1 WHERE id = $2',
        [order.quantity, order.product_id]
      );
    }

    res.json(updatedOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
