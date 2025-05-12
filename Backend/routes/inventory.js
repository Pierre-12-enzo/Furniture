// routes/inventory.js
const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [inventory] = await pool.query(`
      SELECT i.inventoryId, i.productId, p.name, p.sku, i.quantity, p.minimumStock
      FROM Inventory i
      JOIN Products p ON i.productId = p.productId
    `);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/update', auth, async (req, res) => {
  const { productId, quantity, type, notes } = req.body;
  const userId = req.user.userId;
  try {
    await pool.query('START TRANSACTION');
    const [inventory] = await pool.query('SELECT quantity FROM Inventory WHERE productId = ?', [productId]);
    let currentQuantity = inventory[0]?.quantity || 0;
    const newQuantity = type === 'ADD' ? currentQuantity + quantity : currentQuantity - quantity;

    if (newQuantity < 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    if (inventory[0]) {
      await pool.query('UPDATE Inventory SET quantity = ?, updatedAt = NOW() WHERE productId = ?', [newQuantity, productId]);
    } else {
      await pool.query('INSERT INTO Inventory (productId, quantity, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())', [productId, newQuantity]);
    }

    await pool.query(
      'INSERT INTO StockMovements (productId, quantity, type, notes, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [productId, quantity, type, notes, userId]
    );

    await pool.query('COMMIT');
    res.json({ message: 'Stock updated' });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;