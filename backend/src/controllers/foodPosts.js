const FoodPost = require('../models/FoodPost');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all food posts within radius
// @route   GET /api/v1/food-posts
// @access  Public
exports.getFoodPosts = async (req, res, next) => {
    try {
        const { lat, lng, radius = 5, type } = req.query;

        // Get food posts within radius
        const posts = await FoodPost.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: radius * 1000 // Convert km to meters
                }
            },
            ...(type && { type }),
            status: 'available'
        }).populate('user', 'name avatar');

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single food post
// @route   GET /api/v1/food-posts/:id
// @access  Public
exports.getFoodPost = async (req, res, next) => {
    try {
        const post = await FoodPost.findById(req.params.id)
            .populate('user', 'name avatar')
            .populate('assignedTo', 'name avatar');

        if (!post) {
            return next(new ErrorResponse(`Food post not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new food post
// @route   POST /api/v1/food-posts
// @access  Private
exports.createFoodPost = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const post = await FoodPost.create(req.body);

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update food post
// @route   PUT /api/v1/food-posts/:id
// @access  Private
exports.updateFoodPost = async (req, res, next) => {
    try {
        let post = await FoodPost.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse(`Food post not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is post owner
        if (post.user.toString() !== req.user.id) {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`, 401));
        }

        post = await FoodPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete food post
// @route   DELETE /api/v1/food-posts/:id
// @access  Private
exports.deleteFoodPost = async (req, res, next) => {
    try {
        const post = await FoodPost.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse(`Food post not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is post owner
        if (post.user.toString() !== req.user.id) {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this post`, 401));
        }

        await post.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Assign food post to user
// @route   PUT /api/v1/food-posts/:id/assign
// @access  Private
exports.assignFoodPost = async (req, res, next) => {
    try {
        const post = await FoodPost.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse(`Food post not found with id of ${req.params.id}`, 404));
        }

        if (post.status !== 'available') {
            return next(new ErrorResponse('This food post is no longer available', 400));
        }

        post.assignedTo = req.user.id;
        post.status = 'pending';
        await post.save();

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (err) {
        next(err);
    }
}; 