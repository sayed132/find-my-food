const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }],
    foodPost: {
        type: mongoose.Schema.ObjectId,
        ref: 'FoodPost'
    },
    messages: [messageSchema],
    lastMessage: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure participants are unique and limited to 2 users
chatSchema.pre('save', function(next) {
    this.participants = [...new Set(this.participants)];
    if (this.participants.length !== 2) {
        next(new Error('Chat must have exactly 2 participants'));
    }
    next();
});

// Update lastMessage timestamp when new message is added
chatSchema.pre('save', function(next) {
    if (this.messages && this.messages.length > 0) {
        this.lastMessage = this.messages[this.messages.length - 1].createdAt;
    }
    next();
});

module.exports = mongoose.model('Chat', chatSchema); 