const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — file is uploaded to Cloudinary via stream, not saved to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only image files are accepted (jpeg, jpg, png, gif, webp)'));
  },
});

// Helper: upload buffer to Cloudinary via stream
const uploadToCloudinary = (buffer, userId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'yearbook-avatars',
        public_id: `user_${userId}_${Date.now()}`,
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Upload profile picture
router.post('/profile-picture', authMiddleware.verifyToken, upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No image uploaded' });
    }

    const userId = req.user.id;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, userId);
    const profilePictureUrl = result.secure_url;

    // Update users table
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
      profile_picture_url: profilePictureUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: 'error', message: 'Upload failed' });
  }
});

module.exports = router;
