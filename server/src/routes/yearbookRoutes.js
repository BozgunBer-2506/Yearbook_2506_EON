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

// GET all students
router.get('/students', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM students ORDER BY last_name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET messages for a student
router.get('/messages/student/:id', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT m.*, u.first_name || ' ' || u.last_name AS author_name
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
      SELECT m.*, u.first_name || ' ' || u.last_name AS author_name
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

module.exports = router;