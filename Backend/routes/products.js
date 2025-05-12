// routes/products.js (Updated)
const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.productId, p.name, p.sku, p.description, p.price, p.minimumStock, c.name AS categoryName
      FROM Products p
      LEFT JOIN Categories c ON p.categoryId = c.categoryId
    `);
    // Ensure price is a number
    const sanitizedProducts = products.map(product => ({
      ...product,
      price: Number(product.price) || 0
    }));
    res.json(sanitizedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, sku, description, categoryId, price, minimumStock } = req.body;
  try {
    if (!name || !sku || !categoryId || typeof price !== 'number' || price < 0 || !Number.isInteger(minimumStock) || minimumStock < 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const [result] = await pool.query(
      'INSERT INTO Products (name, sku, description, categoryId, price, minimumStock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, sku, description, categoryId, price, minimumStock]
    );
    const [newProduct] = await pool.query(
      'SELECT p.productId, p.name, p.sku, p.description, p.price, p.minimumStock, c.name AS categoryName FROM Products p LEFT JOIN Categories c ON p.categoryId = c.categoryId WHERE p.productId = ?',
      [result.insertId]
    );
    res.json(newProduct[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;