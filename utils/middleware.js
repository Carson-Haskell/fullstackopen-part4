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
  if (error.name === 'ValidationError') {
    if (!req.body.username) {
      return res.status(400).send({ error: 'username required' });
    }
    if (req.body.username.length < 3) {
      return res
        .status(400)
        .send({ error: 'username must be at least 3 characters long' });
    }

    return res.status(400).send({ error: 'expected `username` to be unique' });
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: error.message });
  }

  return next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
