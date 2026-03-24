const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// GET all teachers
router.get('/teachers', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM teachers ORDER BY is_klassenlehrer DESC, id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all students — profile_picture_url is taken from users table first (Cloudinary URL),
// falling back to students table value if not set in users
router.get('/students', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT s.id, s.first_name, s.last_name, s.email, s.bio,
                   COALESCE(u.profile_picture_url, s.profile_picture_url) AS profile_picture_url
            FROM students s
            LEFT JOIN users u ON LOWER(s.email) = LOWER(u.email)
            ORDER BY s.first_name ASC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET messages for a student
router.get('/messages/student/:id', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT m.*, m.from_user_id AS author_id, u.first_name || ' ' || u.last_name AS author_name
      FROM messages m
      LEFT JOIN users u ON m.from_user_id = u.id
      WHERE m.to_student_id = $1
      ORDER BY m.created_at ASC
    `, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET messages for a teacher
router.get('/messages/teacher/:id', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT m.*, m.from_user_id AS author_id, u.first_name || ' ' || u.last_name AS author_name
      FROM messages m
      LEFT JOIN users u ON m.from_user_id = u.id
      WHERE m.to_teacher_id = $1
      ORDER BY m.created_at ASC
    `, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST message to a student (auth required)
router.post('/messages/student/:id', verifyToken, async (req, res) => {
    const { content } = req.body;
    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Nachricht darf nicht leer sein.' });
    }
    try {
        const result = await db.query(
            'INSERT INTO messages (from_user_id, to_student_id, content) VALUES ($1, $2, $3) RETURNING *',
            [req.user.userId, req.params.id, content.trim()]
        );
        // Get author name
        const user = await db.query('SELECT first_name, last_name FROM users WHERE id = $1', [req.user.userId]);
        const row = result.rows[0];
        row.author_name = user.rows[0] ? `${user.rows[0].first_name} ${user.rows[0].last_name}` : 'Unbekannt';
        res.status(201).json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST message to a teacher (auth required)
router.post('/messages/teacher/:id', verifyToken, async (req, res) => {
    const { content } = req.body;
    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Nachricht darf nicht leer sein.' });
    }
    try {
        const result = await db.query(
            'INSERT INTO messages (from_user_id, to_teacher_id, content) VALUES ($1, $2, $3) RETURNING *',
            [req.user.userId, req.params.id, content.trim()]
        );
        const user = await db.query('SELECT first_name, last_name FROM users WHERE id = $1', [req.user.userId]);
        const row = result.rows[0];
        row.author_name = user.rows[0] ? `${user.rows[0].first_name} ${user.rows[0].last_name}` : 'Unbekannt';
        res.status(201).json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE message (only author can delete)
router.delete('/messages/:id', verifyToken, async (req, res) => {
    try {
        const result = await db.query('SELECT from_user_id FROM messages WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nachricht nicht gefunden.' });
        }
        if (result.rows[0].from_user_id !== req.user.userId) {
            return res.status(403).json({ error: 'Du kannst nur deine eigenen Nachrichten löschen.' });
        }
        await db.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
        res.status(200).json({ message: 'Nachricht gelöscht.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE message (only author can update)
router.put('/messages/:id', verifyToken, async (req, res) => {
    const { content } = req.body;
    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Nachricht darf nicht leer sein.' });
    }
    try {
        const result = await db.query('SELECT from_user_id FROM messages WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Nachricht nicht gefunden.' });
        }
        if (result.rows[0].from_user_id !== req.user.userId) {
            return res.status(403).json({ error: 'Du kannst nur deine eigenen Nachrichten bearbeiten.' });
        }
        const update = await db.query(
            'UPDATE messages SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [content.trim(), req.params.id]
        );
        res.status(200).json(update.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
