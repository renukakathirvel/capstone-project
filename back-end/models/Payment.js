const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  method: { type: String, required: true },
  status: { type: String, default: 'success' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
}, { timestamps: true });

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
