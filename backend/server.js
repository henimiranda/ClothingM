const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/scm', require('./routes/scm'));
app.use('/api/production', require('./routes/production'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/orders', require('./routes/orders'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ClothingM API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
