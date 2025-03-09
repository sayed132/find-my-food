const mongoose = require('mongoose');

const foodPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['donation', 'request'],
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    foodType: {
        type: String,
        required: [true, 'Please specify the type of food']
    },
    quantity: {
        type: String,
        required: [true, 'Please specify the quantity']
    },
    expiryTime: {
        type: Date,
        required: [true, 'Please specify when the food will expire']
    },
    images: [{
        type: String
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: String
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'completed'],
        default: 'available'
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Create location index for geospatial queries
foodPostSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('FoodPost', foodPostSchema); 