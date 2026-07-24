const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, refresh, logout, me } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { loginSchema, refreshSchema } = require('../validations/authValidation');

const router = express.Router();

// Tighter limiter on login specifically to blunt credential-stuffing /
// brute-force attempts against admin accounts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

module.exports = router;
