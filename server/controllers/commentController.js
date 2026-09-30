const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../middleware/asyncHandler');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidId(postId)) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comments = await Comment.find({ post: postId })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: comments.length, comments });
});

// @desc    Add a comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!isValidId(postId)) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, 'Comment content is required');
  }
  if (content.trim().length > 1000) {
    throw new ApiError(400, 'Comment cannot exceed 1000 characters');
  }

  const comment = await Comment.create({
    content: content.trim(),
    author: req.user._id,
    post: postId,
  });

  const populatedComment = await comment.populate('author', 'name email');

  res.status(201).json({ success: true, comment: populatedComment });
});

// @desc    Delete a comment (owner only)
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    throw new ApiError(404, 'Comment not found');
  }

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this comment');
  }

  await comment.deleteOne();

  res.status(200).json({ success: true, message: 'Comment deleted successfully' });
});

module.exports = { getComments, createComment, deleteComment };
