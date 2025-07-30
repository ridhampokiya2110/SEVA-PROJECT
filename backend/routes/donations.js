const express = require('express');
const Donation = require('../models/Donation');
const NGO = require('../models/NGO');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all donations (for admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const donations = await Donation.find()
        .populate('donor', 'name email')
        .populate('ngo', 'name category')
        .sort({ createdAt: -1 });
      res.json(donations);
    } else {
      // For regular users, only show their own donations
      const donations = await Donation.find({ donor: req.user._id })
        .populate('ngo', 'name category')
        .sort({ createdAt: -1 });
      res.json(donations);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get donation by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email')
      .populate('ngo', 'name category address contact');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if user can access this donation
    if (req.user.role !== 'admin' && donation.donor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new donation
router.post('/', auth, async (req, res) => {
  try {
    const {
      ngoId,
      foodType,
      foodCategory,
      quantity,
      servingSize,
      pickupLocation,
      pickupDateTime,
      deliveryMethod,
      notes
    } = req.body;

    // Verify NGO exists
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    const donation = new Donation({
      donor: req.user._id,
      ngo: ngoId,
      foodType,
      foodCategory,
      quantity,
      servingSize,
      pickupLocation,
      pickupDateTime,
      deliveryMethod,
      notes
    });

    await donation.save();

    const populatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email')
      .populate('ngo', 'name category');

    res.status(201).json(populatedDonation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update donation status (Admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { status } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('donor', 'name email').populate('ngo', 'name category');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel donation (Donor only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Only donor can cancel their own donation
    if (donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow cancellation if status is pending
    if (donation.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel donation. Status is not pending.' });
    }

    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 