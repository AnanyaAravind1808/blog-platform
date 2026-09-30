const express = require('express');
const {
  getComments,
  createComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Mounted at /api/posts/:postId/comments (needs access to :postId from parent router)
const postCommentsRouter = express.Router({ mergeParams: true });
postCommentsRouter.get('/', getComments);
postCommentsRouter.post('/', protect, createComment);

// Mounted at /api/comments (standalone delete by comment id)
const commentsRouter = express.Router();
commentsRouter.delete('/:id', protect, deleteComment);

module.exports = { postCommentsRouter, commentsRouter };
