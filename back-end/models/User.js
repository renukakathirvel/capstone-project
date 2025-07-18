const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { type: String, required: true }, // Add select: false if you want
  isHost: { type: Boolean, default: false },
  aboutMe: { type: String, default: "", trim: true }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
