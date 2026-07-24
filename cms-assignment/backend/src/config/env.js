require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/renewcred_cms',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(','),
  seedAdmin: {
    email: process.env.SEED_ADMIN_EMAIL || 'admin@renewcred.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    username: process.env.SEED_ADMIN_USERNAME || 'admin',
  },
};

module.exports = env;
