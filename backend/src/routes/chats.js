const express = require('express');
const {
    getChats,
    getChat,
    createChat,
    sendMessage,
    markAsRead
} = require('../controllers/chats');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
    .get(getChats)
    .post(createChat);

router.route('/:id')
    .get(getChat);

router.route('/:id/messages')
    .post(sendMessage);

router.route('/:id/read')
    .put(markAsRead);

module.exports = router; 