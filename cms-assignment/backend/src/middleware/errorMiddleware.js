const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

// Central error handler. Anything thrown as ApiError formats cleanly;
// unexpected errors (bugs, DB hiccups) are logged with full detail but only
// ever surfaced to clients as a generic 500 message to avoid leaking
// internals.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) logger.error(err.message, { stack: err.stack });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate value violates a unique constraint.' });
  }

  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

module.exports = { notFound, errorHandler };
