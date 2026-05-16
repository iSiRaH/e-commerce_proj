const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const authServices = require('../services/authServices');
const { promisify } = require('util');
const prisma = require('../config/connectDb');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// REGISTER
exports.register = catchAsync(async (req, res, next) => {
  const createdUser = await authServices.createUser(req.body, next);
  createSendToken(createdUser, 201, res);
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await authServices.validateUser(email, password);

  if (!user) {
    //FIX: next is not defined error in this
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //IMPLEMENT: FIX this function
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.',
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!currentUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token does no longer exist.',
    });
  }

  req.user = currentUser;
  next();
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
  });
  // res.cookie('jwt', 'loggedout', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true,
  // });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

const safeFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  address: true,
  phone: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
};

exports.getMe = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.id === undefined || req.user.id === null) {
    return next(new AppError('You are not logged in! Please log in.', 401));
  }

  const userId = Number(req.user.id);

  if (Number.isNaN(userId)) {
    return next(new AppError('Invalid user ID.', 400));
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: safeFields,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.id === undefined || req.user.id === null) {
    return next(new AppError('You are not logged in! Please log in.', 401));
  }

  const userId = Number(req.user.id);

  if (Number.isNaN(userId)) {
    return next(new AppError('Invalid user ID.', 400));
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: req.body,
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.id === undefined || req.user.id === null) {
    return next(new AppError('You are not logged in! Please log in.', 401));
  }

  const userId = Number(req.user.id);

  if (Number.isNaN(userId)) {
    return next(new AppError('Invalid user ID.', 400));
  }

  const deletedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: { isActive: 'INACTIVE' },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});
