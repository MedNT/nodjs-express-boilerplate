const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ]
});

// Handle uncaught promise rejections
process.on('unhandledRejection', (ex) => {
  throw ex;
});


// Log levels available:

// - logger.error() - For errors
// - logger.warn() - For warnings
// - logger.info() - For informational messages
// - logger.http() - For HTTP requests
// - logger.verbose() - For verbose output
// - logger.debug() - For debug information
// - logger.silly() - For extremely detailed tracing

module.exports = logger;