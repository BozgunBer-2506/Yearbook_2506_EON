const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');

// Update user profile (first_name, last_name, bio)
router.put('/profile', authMiddleware.verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, bio } = req.body;

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (first_name !== undefined) {
      updates.push(`first_name = $${paramIndex++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push(`last_name = $${paramIndex++}`);
      values.push(last_name);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramIndex++}`);
      values.push(bio);
    }

    if (updates.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No fields to update' });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, first_name, last_name, bio, profile_picture_url`;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ 
      status: 'success', 
      message: 'Profile updated',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ status: 'error', message: 'Update failed' });
  }
});

// Get current user profile
router.get('/profile', authMiddleware.verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT id, email, first_name, last_name, bio, profile_picture_url FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'success', user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch profile' });
  }
});

module.exports = router;
