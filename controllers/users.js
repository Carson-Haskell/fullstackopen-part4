const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});

  if (!users.length > 0) {
    res.status(404).json({ error: 'No users' }).end();
  }

  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
