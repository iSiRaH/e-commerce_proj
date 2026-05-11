const prisma = require('../config/connectDb');
const bcrypt = require('bcrypt');
const AppError = require('../utils/appError');

const comparePasswords = async (inputtedPassword, storedHashedPassword) => {
  return await bcrypt.compare(inputtedPassword, storedHashedPassword);
};

exports.createUser = async (userData, next) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: userData.email.trim(),
    },
  });

  if (existingUser) {
    return next(
      new AppError('Account already exists for this email. Please login.', 409)
    );
  }

  if (userData.password !== userData.passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);

  userData.password = hashedPassword;

  const createdUser = await prisma.user.create({
    data: {
      name: userData.name.trim(),
      email: userData.email.trim(),
      password: userData.password,
      role: userData.role?.trim() || 'CUSTOMER',
    },
  });

  return createdUser;
};

exports.validateUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.trim(),
    },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return user;
};
