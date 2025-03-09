const Review = require('../models/Review');
const FoodPost = require('../models/FoodPost');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/food-posts/:foodPostId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
    try {
        let query;

        if (req.params.foodPostId) {
            query = Review.find({ foodPost: req.params.foodPostId });
        } else {
            query = Review.find();
        }

        const reviews = await query
            .populate({
                path: 'user',
                select: 'name avatar'
            })
            .populate({
                path: 'targetUser',
                select: 'name avatar'
            });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate({
                path: 'user',
                select: 'name avatar'
            })
            .populate({
                path: 'targetUser',
                select: 'name avatar'
            });

        if (!review) {
            return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add review
// @route   POST /api/v1/food-posts/:foodPostId/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
    try {
        req.body.foodPost = req.params.foodPostId;
        req.body.user = req.user.id;

        const foodPost = await FoodPost.findById(req.params.foodPostId);

        if (!foodPost) {
            return next(new ErrorResponse(`No food post with the id of ${req.params.foodPostId}`, 404));
        }

        // Make sure user is not reviewing their own post
        if (foodPost.user.toString() === req.user.id) {
            return next(new ErrorResponse(`User ${req.user.id} cannot review their own food post`, 400));
        }

        req.body.targetUser = foodPost.user;

        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
        }

        // Make sure review belongs to user
        if (review.user.toString() !== req.user.id) {
            return next(new ErrorResponse(`Not authorized to update review`, 401));
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
        }

        // Make sure review belongs to user
        if (review.user.toString() !== req.user.id) {
            return next(new ErrorResponse(`Not authorized to delete review`, 401));
        }

        await review.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
}; 