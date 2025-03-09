const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    targetUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    foodPost: {
        type: mongoose.Schema.ObjectId,
        ref: 'FoodPost',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 5'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment']
    },
    images: [{
        type: String
    }]
}, {
    timestamps: true
});

// Prevent user from submitting more than one review per food post
reviewSchema.index({ foodPost: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 