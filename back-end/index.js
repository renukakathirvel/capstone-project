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

app.get('/test', (req,res) => {
    res.json('test ok');
});
app.post('/register', async (req,res) => {
    const {name,email,password} = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
            });
            res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
    
});

app.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
          jwt.sign({
              email:userDoc.email,
              id:userDoc._id 
          }, jwtSecret, {}, (err,token) => {
            if (err) throw err;
            // Return token in response body instead of just cookie
            res.json({
              user: userDoc,
              token: token
            });
          });
      } else {
          res.status(422).json('password is incorrect');
      }
     } else {
      res.json('user not found');
  }
});

app.get('/profile', (req, res) => {
  // Instead of using cookies, get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(null);
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json(null);
      const {name, email, _id} = await User.findById(userData.id);
      res.json({name, email, _id});
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
  });
  

  app.post('/upload-by-link', async (req,res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
   await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' +newName,
    });
    res.json(newName);
});

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
  const {path,originalname} = req.files[i];
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);
  uploadedFiles.push(newPath.replace('uploads/',''));
}
  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  
  const token = authHeader.substring(7);
  
  const{
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests
  } = req.body;
  
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({error: 'Invalid token'});
    
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    });
    
    res.json(placeDoc);
  });
});

 app.listen(4000);
console.log('server started on port 4000');logout