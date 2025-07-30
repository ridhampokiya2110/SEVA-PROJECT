const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true
  },
  foodType: {
    type: String,
    enum: ['cooked', 'raw'],
    required: true
  },
  foodCategory: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  servingSize: {
    type: Number,
    required: true,
    default: 1
  },
  pickupLocation: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  pickupDateTime: {
    type: Date,
    required: true
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'picked-up', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
donationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Donation', donationSchema); 