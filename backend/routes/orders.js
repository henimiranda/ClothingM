const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create new order
router.post('/', async (req, res) => {
  const { user_id, items, total_amount, shipping_address } = req.body;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert into orders
    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [user_id, total_amount, shipping_address, 'paid']
    );
    const orderId = orderRes.rows[0].id;

    // 2. Process each item
    for (const item of items) {
      // Insert into order_items
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );

      // Update product stock
      await client.query(
        'UPDATE products SET base_stock = base_stock - $1 WHERE id = $2',
        [item.quantity, item.id]
      );

      // Add inventory log (Stock Out)
      await client.query(
        'INSERT INTO inventory_logs (product_id, type, quantity, reason) VALUES ($1, $2, $3, $4)',
        [item.id, 'OUT', item.quantity, `Order #${orderId} purchase`]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send('Server Error');
  } finally {
    client.release();
  }
});

// Get user orders
router.get('/user/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
