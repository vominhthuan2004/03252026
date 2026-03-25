const express = require('express');
const Product = require('../model/Product');
const Inventory = require('../model/Inventory');

const router = express.Router();

// Tạo sản phẩm + tự động tạo inventory (không dùng transaction)
router.post('/products', async (req, res) => {
  try {
    // Tạo product
    const product = await Product.create(req.body);
    
    // Tạo inventory tương ứng
    try {
      const inventory = await Inventory.create({
        product: product._id,
        stock: 0,
        reserved: 0,
        soldCount: 0
      });
      res.status(201).json({ product, inventory });
    } catch (inventoryError) {
      // Nếu tạo inventory thất bại, xóa product vừa tạo để rollback
      await Product.findByIdAndDelete(product._id);
      throw inventoryError;
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Product name already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;