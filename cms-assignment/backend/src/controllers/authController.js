const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  compareToken,
} = require('../utils/tokenService');

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select('+passwordHash +refreshTokenHash');
  // Same error message whether the email doesn't exist or the password is
  // wrong, so login can't be used to enumerate valid admin emails.
  if (!admin || !(await admin.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const accessToken = signAccessToken(admin);
  const refreshToken = signRefreshToken(admin);

  admin.refreshTokenHash = await hashToken(refreshToken);
  admin.lastLoginAt = new Date();
  await admin.save();

  new ApiResponse(200, {
    accessToken,
    refreshToken,
    admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
  }, 'Login successful').send(res, 200);
});

// POST /api/v1/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.forbidden('Invalid or expired refresh token.');
  }

  const admin = await Admin.findById(payload.sub).select('+refreshTokenHash');
  if (!admin || !(await compareToken(refreshToken, admin.refreshTokenHash))) {
    throw ApiError.forbidden('Refresh token not recognized. Please log in again.');
  }

  // Rotate: issue a new pair and invalidate the old refresh token so each
  // token can only be used once.
  const newAccessToken = signAccessToken(admin);
  const newRefreshToken = signRefreshToken(admin);
  admin.refreshTokenHash = await hashToken(newRefreshToken);
  await admin.save();

  new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, 'Token refreshed').send(res, 200);
});

// POST /api/v1/auth/logout
const logout = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(req.admin.id, { refreshTokenHash: null });
  new ApiResponse(200, null, 'Logged out successfully').send(res, 200);
});

// GET /api/v1/auth/me
const me = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin) throw ApiError.notFound('Admin not found');
  new ApiResponse(200, { id: admin._id, username: admin.username, email: admin.email, role: admin.role }).send(res);
});

module.exports = { login, refresh, logout, me };
