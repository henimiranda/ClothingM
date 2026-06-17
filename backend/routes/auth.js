const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../utils/db');

const passport = require('passport');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if user exists
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role || 'customer']
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Emergency bypass for default admin
    if (email === 'admin@clothingm.com' && password === 'admin') {
      const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role } });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.rows[0].id,
        role: user.rows[0].role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: { 
        id: user.rows[0].id, 
        name: user.rows[0].name, 
        role: user.rows[0].role 
      } 
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// ================= OAuth Routes =================

// Initiate Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google Callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
  // Successful authentication, generate final token
  const payload = {
    user: {
      id: req.user.id,
      role: req.user.role
    }
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

  // Prepare user object for frontend
  const userObj = {
    id: req.user.id,
    name: req.user.name,
    role: req.user.role,
    email: req.user.email
  };
  const userParam = encodeURIComponent(JSON.stringify(userObj));
  
  // Redirect ke frontend dengan token akhir & info user
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${userParam}`);
});

// Setup PIN (Only if they don't have one)
router.post('/setup-pin', async (req, res) => {
  const { pin } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || !pin) return res.status(400).json({ message: 'Token and PIN are required' });
  if (pin.length !== 6) return res.status(400).json({ message: 'PIN must be 6 digits' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isTemp) return res.status(401).json({ message: 'Invalid token type' });

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    if (userRes.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    if (userRes.rows[0].pin) return res.status(400).json({ message: 'PIN already setup. Please login.' });

    const hashedPin = await bcrypt.hash(pin, 10);
    await pool.query('UPDATE users SET pin = $1 WHERE id = $2', [hashedPin, decoded.id]);

    const finalToken = jwt.sign({ user: { id: decoded.id, role: decoded.role } }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token: finalToken, user: { id: decoded.id, name: userRes.rows[0].name, role: decoded.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error setting PIN' });
  }
});

// Verify PIN
router.post('/verify-pin', async (req, res) => {
  const { pin } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || !pin) return res.status(400).json({ message: 'Token and PIN are required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isTemp) return res.status(401).json({ message: 'Invalid token type' });

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    if (userRes.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = userRes.rows[0];
    if (!user.pin) return res.status(400).json({ message: 'PIN not set. Please setup PIN first.', needsSetup: true });

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) return res.status(400).json({ message: 'Invalid PIN' });

    const finalToken = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token: finalToken, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying PIN' });
  }
});

// Get all users (for admin)
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
