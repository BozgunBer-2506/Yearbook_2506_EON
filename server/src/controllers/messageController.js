const db = require('../config/db');

exports.getMessagesForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(
            `SELECT m.id, m.from_user_id, m.content, m.created_at, 
              u.first_name, u.last_name, u.profile_picture_url
       FROM messages m
       JOIN users u ON m.from_user_id = u.id
       WHERE m.to_user_id = $1
       ORDER BY m.created_at DESC`,
            [userId]
        );

        return res.status(200).json(result.rows);
    } catch (err) {
        console.error('Get messages error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.postMessage = async (req, res) => {
    const { toUserId } = req.params;
    const { fromUserId, content } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    try {
        const result = await db.query(
            'INSERT INTO messages (from_user_id, to_user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [fromUserId, toUserId, content]
        );

        return res.status(201).json({
            message: 'Message posted successfully',
            data: result.rows[0],
        });
    } catch (err) {
        console.error('Post message error:', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
};
