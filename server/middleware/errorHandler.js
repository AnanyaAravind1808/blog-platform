const ApiError = require('../utils/ApiError');

/**
 * Catches requests to undefined routes and forwards a 404 error.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

/**
 * Centralized error handler. Normalizes Mongoose/JWT/validation errors
 * into consistent JSON responses with meaningful HTTP status codes.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found with id: ${err.value}`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with that ${field} already exists`;
  }

  // JWT errors (in case they bubble up outside of auth middleware)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token has expired';
  }

  if (statusCode === 500) {
    console.error('Unexpected error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

module.exports = { notFound, errorHandler };
