const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Place = require('./models/Place');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path'); // add to top if not already


require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'EuseDRO3AsYb5NlUWZisHQd6DC4fC35O6';

app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  origin: 'http://localhost:5173',
}));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// 🔐 Token verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1]; // remove "Bearer "
  jwt.verify(token, jwtSecret, {}, (err, userData) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = userData;
    next();
  });
}

// ✅ Routes
app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.json({ user: userDoc, token });
        }
      );
    } else {
      res.status(422).json('Password is incorrect');
    }
  } else {
    res.status(404).json('User not found');
  }
});

app.get('/profile', verifyToken, async (req, res) => {
  const userDoc = await User.findById(req.user.id);
  if (!userDoc) return res.status(404).json(null);
  const { name, email, _id } = userDoc;
  res.json({ name, email, _id });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: 'uploads/' });

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path: tempPath, originalname } = req.files[i];
    const ext = originalname.split('.').pop();
    const newPath = tempPath + '.' + ext;

    fs.renameSync(tempPath, newPath);

    // ✅ Clean filename (no directory prefix, works on Windows/Linux/macOS)
    const finalFilename = path.basename(newPath);
    uploadedFiles.push(finalFilename);
  }
  res.json(uploadedFiles);
});

// ✅ Create place (protected)
app.post('/places', verifyToken, async (req, res) => {
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests
  } = req.body;

  try {
    const placeDoc = await Place.create({
      owner: req.user.id,
      title, address,photos:addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    });
    res.json(placeDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while creating place' });
  }
});

app.get('/places', verifyToken, async (req, res) => {
  try {
    const places = await Place.find({ owner: req.user.id });
    res.json(places);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching places' });
  }
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json(place);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid Place ID' });
  }
});
app.put('/places', verifyToken, async (req, res) => {
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests
  } = req.body;

  try {
    const placeDoc = await Place.findById(id);
    if (!placeDoc) return res.status(404).json({ error: 'Place not found' });

    // Check ownership
    if (placeDoc.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this place.' });
    }

    // Update fields
    placeDoc.set({
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests
    });

    await placeDoc.save();
    res.json('Place updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
