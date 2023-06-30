const jwt = require('jsonwebtoken');
const { logInfo, logError } = require('./logger');
const User = require('../models/user');

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
    res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    if (!req.body.username) {
      return res.status(400).send({ error: 'username required' });
    }
    if (req.body.username.length < 3) {
      return res
        .status(400)
        .send({ error: 'username must be at least 3 characters long' });
    }

    res.status(400).send({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: error.message });
  }

  return next(error);
};

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');

    const decodedToken = jwt.verify(token, process.env.SECRET);

    const userId = decodedToken.id.toString();
    const user = await User.findById(userId);

    req.user = user;
  }

  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  }

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
