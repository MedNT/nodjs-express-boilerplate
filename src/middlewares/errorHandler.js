const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl}`);
  res.status(500).json({ message: err.message });
  next();
};

module.exports = { errorHandler };
