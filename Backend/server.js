// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');
const stockMovementRoutes = require('./routes/stockMovements');
const dashboardRoutes = require('./routes/dashboard');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
