const express = require('express');

const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} = require('../controllers/postController');

const { protect } = require('../middleware/auth');

const commentRouter = require('./commentRoutes').postCommentsRouter;

const router = express.Router();

// Nested route: /api/posts/:postId/comments
router.use('/:postId/comments', commentRouter);

// Get all posts
router.get('/', getPosts);

// Get posts created by logged-in user
router.get('/my-posts', protect, getMyPosts);

// Get single post
router.get('/:id', getPostById);

// Create post
router.post('/', protect, createPost);

// Update post
router.put('/:id', protect, updatePost);

// Delete post
router.delete('/:id', protect, deletePost);

module.exports = router;