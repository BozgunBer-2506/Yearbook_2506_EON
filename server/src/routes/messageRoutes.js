const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/:userId', messageController.getMessagesForUser);
router.post('/:toUserId', messageController.postMessage);

module.exports = router;
