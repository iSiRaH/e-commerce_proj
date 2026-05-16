const catchAsync = require('../utils/catchAsync');
const authServices = require('../services/authServices');
const prisma = require('../config/connectDb');
const AppError = require('../utils/appError');

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
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

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: safeFields,
  });
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
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

exports.updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
    select: safeFields,
  });

  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// ADMIN Delete permanently
exports.deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await prisma.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!deletedUser) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
