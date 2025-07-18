const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  address: { type: String, required: true },
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: { type: Number, required: true, min: 0, max: 23 },
  checkOut: { type: Number, required: true, min: 1, max: 24 },
  maxGuests: { type: Number, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

const PlaceModel = mongoose.model('Place', placeSchema);
module.exports = PlaceModel;
