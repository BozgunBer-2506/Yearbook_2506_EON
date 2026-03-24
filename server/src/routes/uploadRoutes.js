const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${userId}_${timestamp}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are accepted (jpeg, jpg, png, gif, webp)'));
  }
});

// Upload profile picture
router.post('/profile-picture', authMiddleware.verifyToken, upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No image uploaded' });
    }

    const userId = req.user.id;
    const profilePictureUrl = `/images/${req.file.filename}`;

    // Update user profile picture in users table
    await db.query(
      'UPDATE users SET profile_picture_url = $1 WHERE id = $2',
      [profilePictureUrl, userId]
    );

    // Also update students table by matching email
    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length > 0) {
      const userEmail = userResult.rows[0].email;
      await db.query(
        'UPDATE students SET profile_picture_url = $1 WHERE email = $2',
        [profilePictureUrl, userEmail]
      );
    }

    res.json({ 
      status: 'success', 
      message: 'Profile picture uploaded',
      profile_picture_url: profilePictureUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: 'error', message: 'Upload failed' });
  }
});

module.exports = router;
