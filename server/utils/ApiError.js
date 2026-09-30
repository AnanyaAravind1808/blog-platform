/**
 * Custom error class used across controllers so the centralized
 * error handling middleware can respond with the correct status code
 * and a consistent JSON shape.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
