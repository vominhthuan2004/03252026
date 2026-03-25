const express = require('express');
const Inventory = require('../model/Inventory');
const Product = require('../model/Product');

const router = express.Router();

// Get all inventories (join với product)
router.get('/inventories', async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('product');
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inventory by ID (join với product)
router.get('/inventories/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('product');
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add stock: POST /inventories/add-stock
router.post('/inventories/add-stock', async (req, res) => {
  const { product, quantity } = req.body;
  if (!product || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  try {
    const inventory = await Inventory.findOne({ product });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });

    inventory.stock += quantity;
    await inventory.save();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove stock: POST /inventories/remove-stock
router.post('/inventories/remove-stock', async (req, res) => {
  const { product, quantity } = req.body;
  if (!product || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  try {
    const inventory = await Inventory.findOne({ product });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    if (inventory.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    inventory.stock -= quantity;
    await inventory.save();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reservation: POST /inventories/reserve
router.post('/inventories/reserve', async (req, res) => {
  const { product, quantity } = req.body;
  if (!product || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  try {
    const inventory = await Inventory.findOne({ product });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    if (inventory.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    inventory.stock -= quantity;
    inventory.reserved += quantity;
    await inventory.save();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sold: POST /inventories/sold
router.post('/inventories/sold', async (req, res) => {
  const { product, quantity } = req.body;
  if (!product || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  try {
    const inventory = await Inventory.findOne({ product });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    if (inventory.reserved < quantity) {
      return res.status(400).json({ message: 'Insufficient reserved quantity' });
    }

    inventory.reserved -= quantity;
    inventory.soldCount += quantity;
    await inventory.save();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;