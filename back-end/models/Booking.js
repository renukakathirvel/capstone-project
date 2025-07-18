const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Place' },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  checkIn: { type: Date, required: true },
  checkOut: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.checkIn;
      },
      message: 'checkOut must be after checkIn',
    },
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  numberOfGuests: { type: Number, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;
