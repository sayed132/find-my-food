const express = require('express');
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    addComment,
    toggleLike
} = require('../controllers/blogs');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getBlogs)
    .post(protect, createBlog);

router.route('/:id')
    .get(getBlog)
    .put(protect, updateBlog)
    .delete(protect, deleteBlog);

router.route('/:id/comments')
    .post(protect, addComment);

router.route('/:id/like')
    .put(protect, toggleLike);

module.exports = router; 