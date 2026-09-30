const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;

  const filter = {};

  // Search by title or content
  if (search && search.trim()) {
    filter.$or = [
      {
        title: {
          $regex: search.trim(),
          $options: 'i',
        },
      },
      {
        content: {
          $regex: search.trim(),
          $options: 'i',
        },
      },
    ];
  }

  // Filter by category
  if (category && category.trim()) {
    filter.category = category.trim();
  }

  const posts = await Post.find(filter)
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    'author',
    'name email'
  );

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.status(200).json({
    success: true,
    post,
  });
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags } = req.body;

  // Validate title
  if (!title || !title.trim()) {
    res.status(400);
    throw new Error('Title is required');
  }

  // Validate content
  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Content is required');
  }

  const post = await Post.create({
    title: title.trim(),
    content: content.trim(),
    category: category || 'Technology',
    tags: Array.isArray(tags) ? tags : [],
    author: req.user._id,
  });

  const populatedPost = await Post.findById(post._id).populate(
    'author',
    'name email'
  );

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    post: populatedPost,
  });
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const { title, content, category, tags } = req.body;

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Only the author can update the post
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not authorized to update this post');
  }

  // Update title
  if (title !== undefined) {
    if (!title.trim()) {
      res.status(400);
      throw new Error('Title is required');
    }

    post.title = title.trim();
  }

  // Update content
  if (content !== undefined) {
    if (!content.trim()) {
      res.status(400);
      throw new Error('Content is required');
    }

    post.content = content.trim();
  }

  // Update category
  if (category !== undefined) {
    post.category = category;
  }

  // Update tags
  if (tags !== undefined) {
    post.tags = Array.isArray(tags) ? tags : [];
  }

  await post.save();

  const updatedPost = await Post.findById(post._id).populate(
    'author',
    'name email'
  );

  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    post: updatedPost,
  });
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Only the author can delete the post
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not authorized to delete this post');
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
  });
});
// @desc    Get posts created by logged-in user
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({
    author: req.user._id,
  })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
};