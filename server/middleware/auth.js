const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

/**
 * Verifies the JWT sent in the Authorization header ("Bearer <token>"),
 * loads the corresponding user, and attaches it to req.user.
 * Rejects missing, invalid, or expired tokens with 401.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Not authorized, token has expired');
    }
    throw new ApiError(401, 'Not authorized, invalid token');
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, 'Not authorized, user no longer exists');
  }

  req.user = user;
  next();
});

module.exports = { protect };
