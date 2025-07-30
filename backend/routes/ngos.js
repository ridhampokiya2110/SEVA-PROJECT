const express = require('express');
const NGO = require('../models/NGO');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all NGOs
router.get('/', async (req, res) => {
  try {
    const ngos = await NGO.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get NGO by ID
router.get('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get NGOs by category
router.get('/category/:category', async (req, res) => {
  try {
    const ngos = await NGO.find({ 
      category: req.params.category, 
      isActive: true 
    }).sort({ createdAt: -1 });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new NGO (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const ngo = new NGO(req.body);
    await ngo.save();
    res.status(201).json(ngo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update NGO (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete NGO (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const ngo = await NGO.findByIdAndDelete(req.params.id);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.json({ message: 'NGO deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 