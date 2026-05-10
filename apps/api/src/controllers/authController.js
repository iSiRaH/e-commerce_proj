const prisma = require('../config/connectDb');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res) => {
  const createdUser = await prisma.user.create({
    data: {
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      password: req.body.password,
      role: req.body.role?.trim() || 'CUSTOMER',
    },
  });

  res.status(201).json({
    status: 'success',
    data: createdUser,
  });
});
