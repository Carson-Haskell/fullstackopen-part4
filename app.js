const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const cors = require('cors');
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const { logInfo, logError } = require('./utils/logger');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

mongoose.set('strictQuery', false);

logInfo('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logInfo('connected to MongoDB'))
  .catch((err) => logError('error connecting to MongoDB', err.message));

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
