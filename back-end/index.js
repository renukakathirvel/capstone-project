require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET || 'default_secret';

app.use(cors({
  origin: 'https://dev-renuka-bnb.netlify.app',
  credentials: true,
}));
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(helmet());
app.use('/api/v1', userRoutes);
app.use('/api/v1/payments', paymentRoutes);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;
    if (!token) return reject(new Error('No token found'));

    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) reject(err);
      else resolve(userData);
    });
  });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, jwtSecret, {}, (err, userData) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = userData;
    next();
  });
}

// Routes
app.get('/api/v1/test', (req, res) => {
  res.json('Server is working ✅');
});

app.post('/api/v1/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json({ error: 'Registration failed' });
  }
});

app.post('/api/v1/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(404).json({ error: 'User not found' });

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) return res.status(422).json({ error: 'Incorrect password' });

    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.json({ user: userDoc, token });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/v1/profile', verifyToken, async (req, res) => {
  const userDoc = await User.findById(req.user.id);
  if (!userDoc) return res.status(404).json(null);
  const { name, email, _id } = userDoc;
  res.json({ name, email, _id });
});

app.get('/user-places', verifyToken, async (req, res) => {
  const filterPerks = ['wifi', 'parking', 'tv', 'radio', 'pets', 'entrance'];
  const selectedPerks = filterPerks.filter(perk => req.query[perk] === 'true');

  const filters = selectedPerks.length > 0 ? { perks: { $in: selectedPerks } } : {};

  const places = await Place.find({ owner: req.user.id, ...filters });
  res.json(places);
});
app.post('/api/v1/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

app.post('/api/v1/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  try {
    await imageDownloader.image({
      url: link,
      dest: path.join(__dirname, '/uploads/', newName),
    });
    res.json(newName);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download image' });
  }
});

const photosMiddleware = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post('/api/v1/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = req.files.map(file => {
    const ext = path.extname(file.originalname).toLowerCase();
    const newPath = file.path + ext;
    fs.renameSync(file.path, newPath);
    return path.basename(newPath);
  });
  res.json(uploadedFiles);
});

app.post('/api/v1/places', verifyToken, async (req, res) => {
  const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  try {
    const placeDoc = await Place.create({
      owner: req.user.id,
      title, address, photos: addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price
    });
    res.json(placeDoc);
  } catch (err) {
    res.status(500).json({ error: 'Error creating place' });
  }
});

app.get('/api/v1/user-places', verifyToken, async (req, res) => {
  try {
    const places = await Place.find({ owner: req.user.id });
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user places' });
  }
});

app.get('/api/v1/places/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(400).json({ error: 'Invalid place ID' });
  }
});

app.put('/api/v1/places', verifyToken, async (req, res) => {
  const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  try {
    const placeDoc = await Place.findById(id);
    if (!placeDoc) return res.status(404).json({ error: 'Place not found' });
    if (placeDoc.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    placeDoc.set({ title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price });
    await placeDoc.save();
    res.json('Place updated successfully');
  } catch (err) {
    res.status(500).json({ error: 'Error updating place' });
  }
});

app.get('/api/v1/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching places' });
  }
});

app.post('/api/v1/bookings', verifyToken, async (req, res) => {
  try {
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
    const booking = await Booking.create({
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
      user: req.user.id,
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
});

app.get('/api/v1/bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('place');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
  });

app.get('/api/v1/bookings/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('place');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching booking' });
  }
});

app.post('/api/v1/reviews', verifyToken, async (req, res) => {
  try {
    const { placeId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      user: req.user.id, 
      place: placeId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create review', details: err.message });
  }

  console.log("Received review request:", req.body);
});

app.get('/api/v1/reviews/:placeId', async (req, res) => {
  try {
    const reviews = await Review.find({ place: req.params.placeId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch reviews', details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});