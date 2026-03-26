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

// Multer configuration with 10MB limit and English/German filtering
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    // Error message in German for the UI
    cb(new Error('Nur Bilddateien sind erlaubt (jpeg, jpg, png, gif, webp)'));
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

// POST: Upload profile picture
router.post('/profile-picture', authMiddleware.verifyToken, (req, res, next) => {
  // Custom Multer error handler for file size limits
  upload.single('picture')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Die Datei ist zu groß. Maximale Größe ist 10MB.' 
        });
      }
      return res.status(400).json({ status: 'error', message: err.message });
    } else if (err) {
      return res.status(400).json({ status: 'error', message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Kein Bild hochgeladen' });
    }

    const userId = req.user.userId;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, userId);
    const profilePictureUrl = result.secure_url;

    // Update users table
    await db.query(
      'UPDATE users SET profile_picture_url = $1 WHERE id = $2',
      [profilePictureUrl, userId]
    );

    // Update students table by matching email
    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length > 0) {
      const userEmail = userResult.rows[0].email;
      await db.query(
        'UPDATE students SET profile_picture_url = $1 WHERE LOWER(email) = LOWER($2)',
        [profilePictureUrl, userEmail]
      );
    }

    res.json({
      status: 'success',
      message: 'Profilbild erfolgreich hochgeladen',
      profile_picture_url: profilePictureUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: 'error', message: 'Upload fehlgeschlagen' });
  }
});

// DELETE: Remove profile picture
router.delete('/profile-picture', authMiddleware.verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userResult = await db.query('SELECT email, profile_picture_url FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Benutzer nicht gefunden' });
    }

    const { email, profile_picture_url } = userResult.rows[0];

    // Remove from Cloudinary if exists
    if (profile_picture_url && profile_picture_url.includes('cloudinary.com')) {
      try {
        const matches = profile_picture_url.match(/yearbook-avatars\/[^.]+/);
        if (matches) {
          await cloudinary.uploader.destroy(matches[0]);
        }
      } catch (cloudErr) {
        console.warn('Cloudinary delete warning:', cloudErr.message);
      }
    }

    // Reset database fields
    await db.query('UPDATE users SET profile_picture_url = NULL WHERE id = $1', [userId]);
    await db.query('UPDATE students SET profile_picture_url = NULL WHERE LOWER(email) = LOWER($1)', [email]);

    res.json({ status: 'success', message: 'Profilbild gelöscht' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ status: 'error', message: 'Löschen fehlgeschlagen' });
  }
});

module.exports = router;