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

    // JWT token stores userId (not id) — must use req.user.userId
    const userId = req.user.userId;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, userId);
    const profilePictureUrl = result.secure_url;

    // Update users table
    await db.query(
      'UPDATE users SET profile_picture_url = $1 WHERE id = $2',
      [profilePictureUrl, userId]
    );

    // Also update students table by matching email (case-insensitive)
    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length > 0) {
      const userEmail = userResult.rows[0].email;
      const studentUpdate = await db.query(
        'UPDATE students SET profile_picture_url = $1 WHERE LOWER(email) = LOWER($2)',
        [profilePictureUrl, userEmail]
      );
      console.log(`[Upload] students table updated: ${studentUpdate.rowCount} row(s) for email: ${userEmail}`);
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

// Delete profile picture
router.delete('/profile-picture', authMiddleware.verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get current profile picture URL from users table
    const userResult = await db.query('SELECT email, profile_picture_url FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const { email, profile_picture_url } = userResult.rows[0];

    // Delete from Cloudinary if it's a Cloudinary URL
    if (profile_picture_url && profile_picture_url.includes('cloudinary.com')) {
      try {
        // Extract public_id from URL (e.g. yearbook-avatars/user_5_1234567890)
        const matches = profile_picture_url.match(/yearbook-avatars\/[^.]+/);
        if (matches) {
          await cloudinary.uploader.destroy(matches[0]);
          console.log(`[Upload] Cloudinary image deleted: ${matches[0]}`);
        }
      } catch (cloudErr) {
        console.warn('[Upload] Cloudinary delete warning:', cloudErr.message);
        // Continue even if Cloudinary delete fails
      }
    }

    // Clear profile_picture_url in users table
    await db.query('UPDATE users SET profile_picture_url = NULL WHERE id = $1', [userId]);

    // Clear profile_picture_url in students table
    await db.query(
      'UPDATE students SET profile_picture_url = NULL WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    res.json({ status: 'success', message: 'Profile picture deleted' });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({ status: 'error', message: 'Delete failed' });
  }
});

module.exports = router;
