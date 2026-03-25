const express = require('express');
const mongoose = require('mongoose');

const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
app.use(express.json());

// Kết nối MongoDB (đường dẫn cứng)
const MONGODB_URI = 'mongodb://localhost:27017/inventory_db';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', productRoutes);
app.use('/api', inventoryRoutes);

// Cổng server (cứng)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});