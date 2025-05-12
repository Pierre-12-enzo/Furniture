// routes/stockMovements.js (Updated)
const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    let query = `
      SELECT sm.movementId, sm.productId, sm.quantity, sm.type, sm.notes, sm.createdAt,
             p.name AS productName, p.sku, u.username
      FROM StockMovements sm
      JOIN Products p ON sm.productId = p.productId
      LEFT JOIN Users u ON sm.userId = u.userId
    `;
    const params = [];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      if (start > end) {
        return res.status(400).json({ error: 'Start date cannot be after end date' });
      }
      query += ` WHERE sm.createdAt BETWEEN ? AND ?`;
      params.push(startDate, `${endDate} 23:59:59`);
    }
    query += ` ORDER BY sm.createdAt DESC`;
    const [movements] = await pool.query(query, params);
    res.json(movements);
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;