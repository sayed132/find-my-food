const Chat = require('../models/Chat');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all chats for a user
// @route   GET /api/v1/chats
// @access  Private
exports.getChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({
            participants: req.user.id
        })
            .populate('participants', 'name avatar')
            .populate('foodPost', 'title type')
            .sort('-lastMessage');

        res.status(200).json({
            success: true,
            count: chats.length,
            data: chats
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single chat
// @route   GET /api/v1/chats/:id
// @access  Private
exports.getChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('participants', 'name avatar')
            .populate('foodPost', 'title type')
            .populate('messages.sender', 'name avatar');

        if (!chat) {
            return next(new ErrorResponse(`Chat not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is part of the chat
        if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
            return next(new ErrorResponse(`Not authorized to access this chat`, 401));
        }

        res.status(200).json({
            success: true,
            data: chat
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new chat
// @route   POST /api/v1/chats
// @access  Private
exports.createChat = async (req, res, next) => {
    try {
        const { participant, foodPost } = req.body;

        // Check if chat already exists
        const existingChat = await Chat.findOne({
            participants: { $all: [req.user.id, participant] },
            foodPost
        });

        if (existingChat) {
            return res.status(200).json({
                success: true,
                data: existingChat
            });
        }

        const chat = await Chat.create({
            participants: [req.user.id, participant],
            foodPost
        });

        res.status(201).json({
            success: true,
            data: chat
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Send message in chat
// @route   POST /api/v1/chats/:id/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return next(new ErrorResponse(`Chat not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is part of the chat
        if (!chat.participants.some(p => p.toString() === req.user.id)) {
            return next(new ErrorResponse(`Not authorized to send messages in this chat`, 401));
        }

        const message = {
            sender: req.user.id,
            content: req.body.content
        };

        chat.messages.push(message);
        await chat.save();

        // Populate the sender info for the new message
        const populatedChat = await Chat.findById(chat._id)
            .populate('messages.sender', 'name avatar');

        // Get the newly added message
        const newMessage = populatedChat.messages[populatedChat.messages.length - 1];

        res.status(200).json({
            success: true,
            data: newMessage
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark messages as read
// @route   PUT /api/v1/chats/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return next(new ErrorResponse(`Chat not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is part of the chat
        if (!chat.participants.some(p => p.toString() === req.user.id)) {
            return next(new ErrorResponse(`Not authorized to access this chat`, 401));
        }

        // Mark all unread messages as read
        chat.messages.forEach(message => {
            if (message.sender.toString() !== req.user.id && !message.read) {
                message.read = true;
            }
        });

        await chat.save();

        res.status(200).json({
            success: true,
            data: chat
        });
    } catch (err) {
        next(err);
    }
}; 