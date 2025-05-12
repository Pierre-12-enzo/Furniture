// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query('SELECT userId, username, email FROM Users WHERE userId = ?', [decoded.userId]);
    const user = users[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
    const user = users[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;