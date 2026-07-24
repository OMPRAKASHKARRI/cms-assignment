const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Verifies a Bearer access token and attaches the admin claims to req.admin.
// Kept separate from refresh-token verification (different secret, longer
// life, stored hashed) so a leaked access token can't be replayed as a
// refresh token.
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Access denied. No authentication credentials found.');
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret);
    req.admin = { id: decoded.sub, username: decoded.username, role: decoded.role };
    next();
  } catch (err) {
    throw ApiError.forbidden('Invalid or expired authorization token.');
  }
});

const requireRole = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action.'));
  }
  next();
};

module.exports = { protect, requireRole };
