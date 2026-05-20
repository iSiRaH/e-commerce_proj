const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const authServices = require('../services/authServices');
const { promisify } = require('util');
const prisma = require('../config/connectDb');
const AppError = require('../utils/appError');
const sendmail = require('../utils/email');

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
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('Decoded token:', decoded); //TEST
  console.log('Decoded token ID:', decoded.id);

  if (!decoded || decoded.id === undefined || decoded.id === null) {
    return next(new AppError('Invalid token payload.', 401));
  }

  const decodedUserId = Number(decoded.id);

  if (Number.isNaN(decodedUserId)) {
    return next(new AppError('Invalid token user ID.', 401));
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: decodedUserId,
    },
  });

  if (currentUser) {
    console.log('Current User ID:', currentUser.id); //TEST
  }
  if (!currentUser || currentUser.isActive === 'INACTIVE') {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  if (authServices.isChangePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
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
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email.trim(),
    },
  });

  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  const { resetToken, passwordResetToken, passwordResetExpires } =
    authServices.createPasswordResetToken();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken,
      passwordResetExpires,
    },
  });

  const appBaseUrl = process.env.APP_BASE_URL;
  if (!appBaseUrl) {
    return next(
      new AppError('APP_BASE_URL is not configured for password reset links.', 500)
    );
  }

  const resetUrl = new URL(
    `/api/v1/auth/resetPassword/${resetToken}`,
    appBaseUrl
  ).toString();

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}. \nIf you didn't forget your password, please ignore this email!`;

  console.log('Password reset URL:', resetUrl); //TEST

  try {
    await sendmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      },
    });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  } else {
    console.log('User found for password reset:', user.id); //TEST
  }

  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    return next(
      new AppError('Please provide password and passwordConfirm', 400)
    );
  }

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date(),
    },
  });

  createSendToken(updatedUser, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.user.id),
    },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (
    !(await authServices.comparePasswords(
      req.body.currentPassword,
      user.password
    ))
  ) {
    return next(new AppError('Current password is incorrect', 401));
  }

  const newPassword = req.body.newPassword;
  const newPasswordConfirm = req.body.newPasswordConfirm;

  if (!newPassword || !newPasswordConfirm) {
    return next(
      new AppError('Please provide a new password and passwordConfirm', 400)
    );
  }

  if (newPassword !== newPasswordConfirm) {
    return next(new AppError('New passwords do not match', 400));
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedNewPassword,
      passwordChangedAt: new Date(),
    },
  });

  createSendToken(updatedUser, 200, res);
});
