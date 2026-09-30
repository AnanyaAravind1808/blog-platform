const User = require('../models/User');

const generateToken = require('../utils/generateToken');

const ApiError = require('../utils/ApiError');

const asyncHandler = require('../middleware/asyncHandler');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Name is required');
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    throw new ApiError(400, 'A valid email is required');
  }

  if (!password || password.length < 6) {
    throw new ApiError(
      400,
      'Password must be at least 6 characters long'
    );
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new ApiError(
      400,
      'An account with that email already exists'
    );
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Authenticate a user and return a token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = {
  register,
  login,
  getMe,
};