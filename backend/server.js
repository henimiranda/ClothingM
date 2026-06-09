const express = require('express');
const cors = require('cors');
const pool = require('./utils/db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://clothing-m.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

const passport = require('./config/passport');
app.use(passport.initialize());

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

// Root Route Status
app.get('/', (req, res) => {
  res.send('ClothingM API is running. Please access the frontend at the main domain.');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
