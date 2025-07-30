const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['orphanage', 'old-age-home', 'homeless-shelter', 'disaster-relief', 'other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    required: true
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  capacity: {
    type: Number,
    default: 0
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NGO', ngoSchema); 