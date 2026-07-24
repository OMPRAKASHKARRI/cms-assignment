const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    logger.info(`CMS backend listening on port ${env.port} [${env.nodeEnv}]`);
  });
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: reason?.message || reason });
});

start();
