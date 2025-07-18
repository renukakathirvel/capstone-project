const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

// PATCH or PUT works here
router.put('/about', verifyToken, async (req, res) => {
  const { aboutMe } = req.body;

  if (typeof aboutMe !== 'string' || aboutMe.length > 500) {
    return res.status(400).json({ error: 'Invalid About Me content' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { aboutMe },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...safeUser } = user.toObject();
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Could not update About Me" });
  }
});

module.exports = router;
