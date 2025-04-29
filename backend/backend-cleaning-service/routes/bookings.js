const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const router = express.Router();

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all bookings for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user.userId }).populate('service_id');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const { customer_name, address, date_time, service_id } = req.body;
    if (!customer_name || !address || !date_time || !service_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const booking = new Booking({ ...req.body, user_id: req.user.userId });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user_id: req.user.userId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    Object.assign(booking, req.body);
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user_id: req.user.userId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
