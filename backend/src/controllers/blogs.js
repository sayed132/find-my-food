const Blog = require('../models/Blog');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find()
            .populate('user', 'name avatar')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single blog
// @route   GET /api/v1/blogs/:id
// @access  Public
exports.getBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('user', 'name avatar')
            .populate('comments.user', 'name avatar');

        if (!blog) {
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new blog
// @route   POST /api/v1/blogs
// @access  Private
exports.createBlog = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const blog = await Blog.create(req.body);

        res.status(201).json({
            success: true,
            data: blog
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Private
exports.updateBlog = async (req, res, next) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is blog owner
        if (blog.user.toString() !== req.user.id) {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this blog`, 401));
        }

        blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is blog owner
        if (blog.user.toString() !== req.user.id) {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this blog`, 401));
        }

        await blog.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add comment to blog
// @route   POST /api/v1/blogs/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
        }

        const comment = {
            user: req.user.id,
            text: req.body.text
        };

        blog.comments.push(comment);
        await blog.save();

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Like/Unlike blog
// @route   PUT /api/v1/blogs/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
        }

        // Check if blog has already been liked by user
        const liked = blog.likes.includes(req.user.id);

        if (liked) {
            // Unlike
            blog.likes = blog.likes.filter(like => like.toString() !== req.user.id);
        } else {
            // Like
            blog.likes.push(req.user.id);
        }

        await blog.save();

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (err) {
        next(err);
    }
}; 