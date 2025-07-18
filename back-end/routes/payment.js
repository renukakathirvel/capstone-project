const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { method, bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const totalAmount = booking.price; // Using what's already in Booking model

    const payment = await Payment.create({
      user: req.user.id,
      amount: totalAmount,
      method,
      booking: bookingId,
      status: 'success'
    });

    res.json({ success: true, payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

module.exports = router;
