const prisma = require('../config/connectDb');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AppError = require('../utils/appError');

exports.comparePasswords = async (inputtedPassword, storedHashedPassword) => {
  return await bcrypt.compare(inputtedPassword, storedHashedPassword);
};

exports.isChangePasswordAfter = (JWTTimeStamp) => {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log('JWTTimeStamp:', JWTTimeStamp);
    console.log('changedTimeStamp:', changedTimeStamp);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
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

  if (user.isActive !== 'ACTIVE') {
    return null;
  }

  const isPasswordValid = await this.comparePasswords(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return user;
};

exports.createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return { resetToken, passwordResetToken, passwordResetExpires };
};
