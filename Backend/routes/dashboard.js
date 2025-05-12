// routes/dashboard.js (Updated)
const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    let lowStockQuery = `
      SELECT p.productId, p.name, p.sku, i.quantity, p.minimumStock
      FROM Products p
      JOIN Inventory i ON p.productId = i.productId
      WHERE i.quantity <= p.minimumStock
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
      lowStockQuery = `
        SELECT p.productId, p.name, p.sku, i.quantity, p.minimumStock
        FROM Products p
        JOIN Inventory i ON p.productId = i.productId
        LEFT JOIN StockMovements sm ON p.productId = sm.productId
        WHERE i.quantity <= p.minimumStock
        AND (sm.createdAt IS NULL OR sm.createdAt BETWEEN ? AND ?)
        GROUP BY p.productId
      `;
      params.push(startDate, `${endDate} 23:59:59`);
    }
    const [lowStock] = await pool.query(lowStockQuery, params);
    const [totalValue] = await pool.query(`
      SELECT COALESCE(SUM(i.quantity * p.price), 0) AS totalInventoryValue
      FROM Inventory i
      JOIN Products p ON i.productId = i.productId
    `);
    res.json({
      lowStock,
      totalInventoryValue: Number(totalValue[0].totalInventoryValue)
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;