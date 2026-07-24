const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

function signAccessToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), username: admin.username, role: admin.role },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpires }
  );
}

function signRefreshToken(admin) {
  return jwt.sign({ sub: admin._id.toString() }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpires,
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

// Refresh tokens are stored server-side only as a bcrypt hash, mirroring how
// we treat passwords — if the DB leaks, raw refresh tokens aren't exposed,
// and rotating on every use limits the blast radius of a stolen token.
async function hashToken(token) {
  return bcrypt.hash(token, 10);
}

async function compareToken(token, hash) {
  if (!hash) return false;
  return bcrypt.compare(token, hash);
}

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken, compareToken };
