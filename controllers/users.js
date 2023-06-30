const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  });

  if (!users.length > 0) {
    res.status(404).json({ error: 'No users' }).end();
  }

  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password) res.status(400).json({ error: 'password required' }).end();

  if (password.length < 3) {
    res
      .status(400)
      .json({ error: 'password must be at least 3 characters long' })
      .end();
  }

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
