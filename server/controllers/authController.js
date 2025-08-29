/* eslint-disable no-plusplus */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

const registerUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
  });

  createSendToken(newUser, 201, res);
});

const loginUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return next(new AppError('Please enter your username and password', 400));

  const user = await User.findOne({ username });

  if (!user || !(await user.correctPassword(password, user.password))) {
    if (!user) next(new AppError('The username you entered does not match our records.'), 400);

    return next(new AppError('Incorrect username or password.', 401));
  }

  createSendToken(user, 200, res);
});

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) return next(new AppError('You are not logged in. Please login to get access', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('User does not exist anymore', 401));

  req.user = currentUser;
  next();
});

module.exports = {
  loginUser,
  registerUser,
  protect,
};
