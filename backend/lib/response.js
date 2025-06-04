/**
 * Standardized response format for API endpoints
 */

/**
 * Send a successful response
 * @param {object} res - Express response object
 * @param {*} data - Data to send in the response
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} errors - Optional error details
 */
const sendError = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
};

// Common error responses
const notFound = (res, resource = 'Resource') => 
  sendError(res, `${resource} not found`, 404);

const unauthorized = (res, message = 'Unauthorized') => 
  sendError(res, message, 401);

const forbidden = (res, message = 'Forbidden') =>
  sendError(res, message, 403);

const validationError = (res, errors) =>
  sendError(res, 'Validation failed', 422, errors);

module.exports = {
  sendSuccess,
  sendError,
  notFound,
  unauthorized,
  forbidden,
  validationError
};
