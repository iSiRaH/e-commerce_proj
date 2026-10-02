const prisma = require('../config/connectDb');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AppError = require('../utils/appError');

exports.comparePasswords = async (inputtedPassword, storedHashedPassword) => {
  if (!inputtedPassword || !storedHashedPassword || typeof storedHashedPassword !== 'string') {
    return false;
  }
  return await bcrypt.compare(inputtedPassword, storedHashedPassword);
};

exports.isChangePasswordAfter = (passwordChangedAt, JWTTimeStamp) => {
  if (passwordChangedAt) {
    const changedTimeStamp = parseInt(passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

exports.createUser = async (userData) => {
  if (!userData.email || !userData.password) {
    throw new AppError('Please provide an email and password', 400);
  }

  const cleanEmail = userData.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: cleanEmail,
    },
  });

  if (existingUser) {
    throw new AppError('Account already exists for this email. Please login.', 409);
  }

  if (userData.passwordConfirm && userData.password !== userData.passwordConfirm) {
    throw new AppError('Passwords do not match', 400);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const cleanRole = ['CUSTOMER', 'SELLER', 'ADMIN'].includes(userData.role?.toUpperCase())
    ? userData.role.toUpperCase()
    : 'CUSTOMER';

  const cleanName = userData.name && userData.name.trim()
    ? userData.name.trim()
    : cleanEmail.split('@')[0];

  const createdUser = await prisma.user.create({
    data: {
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: cleanRole,
      address: userData.address || null,
      phone: userData.phone || null,
      avatar: userData.avatar || (cleanRole === 'ADMIN'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'
        : cleanRole === 'SELLER'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'),
      isActive: 'ACTIVE',
    },
  });

  return createdUser;
};

exports.validateUser = async (email, password) => {
  if (!email || !password) return null;

  const cleanEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: cleanEmail,
    },
  });

  if (!user || !user.password) {
    return null;
  }

  if (user.isActive && user.isActive !== 'ACTIVE') {
    return null;
  }

  const isPasswordValid = await exports.comparePasswords(
    password,
    user.password
  );

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
