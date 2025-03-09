const express = require('express');
const {
    getFoodPosts,
    getFoodPost,
    createFoodPost,
    updateFoodPost,
    deleteFoodPost,
    assignFoodPost
} = require('../controllers/foodPosts');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getFoodPosts)
    .post(protect, createFoodPost);

router.route('/:id')
    .get(getFoodPost)
    .put(protect, updateFoodPost)
    .delete(protect, deleteFoodPost);

router.put('/:id/assign', protect, assignFoodPost);

module.exports = router; 