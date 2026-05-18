const express = require('express');
const pool = require('../utils/db');
const multer = require('multer');
const { uploadToMinio } = require('../utils/s3');

const router = express.Router();

// Multer config for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Add new product with MinIO upload
router.post('/', upload.single('image'), async (req, res) => {
  const { name, description, price, base_stock, category, size } = req.body;
  let image_url = req.body.image_url;

  try {
    // If a file is uploaded, upload it to MinIO
    if (req.file) {
      image_url = await uploadToMinio(req.file, 'erp-files');
    }

    const newProduct = await pool.query(
      'INSERT INTO products (name, description, price, base_stock, category, size, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, base_stock, category, size, image_url]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to upload or save product' });
  }
});

module.exports = router;
