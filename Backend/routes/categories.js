// routes/categories.js
const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM Categories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO Categories (name, description, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [name, description]
    );
    res.status(201).json({ message: 'Category created' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await pool.query(
      'UPDATE Categories SET name = ?, description = ?, updatedAt = NOW() WHERE categoryId = ?',
      [name, description, id]
    );
    res.json({ message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Categories WHERE categoryId = ?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;