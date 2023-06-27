const { logInfo, logError } = require('./logger');

const requestLogger = (req, res, next) => {
  logInfo('Method:', req.method);
  logInfo('Path: ', req.path);
  logInfo('Body: ', req.body);
  logInfo('--');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logError(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  return next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
