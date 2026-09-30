const User = require('../models/User');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const [userCount, postCount] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      users: userCount,
      posts: postCount,
    },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Get all posts
// @route   GET /api/admin/posts
// @access  Admin
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});

// @desc    Delete any post
// @route   DELETE /api/admin/posts/:id
// @access  Admin
const deleteAnyPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully by admin',
  });
});

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllPosts,
  deleteAnyPost,
};