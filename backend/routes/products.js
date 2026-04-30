const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add new product
router.post('/', async (req, res) => {
  const { name, description, price, base_stock, category, size, image_url } = req.body;
  try {
    const newProduct = await pool.query(
      'INSERT INTO products (name, description, price, base_stock, category, size, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, base_stock, category, size, image_url]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
