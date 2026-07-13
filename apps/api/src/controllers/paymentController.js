const catchAsync = require('../utils/catchAsync');
const prisma = require('../config/connectDb');
const AppError = require('../utils/appError');

const safeFields = {
  paymentId: true,
  orderId: true,
  userId: true,
  amount: true,
  paymentMethod: true,
  paymentStatus: true,
  transactionId: true,
  createdAt: true,
  updatedAt: true,
};

exports.createPayment = catchAsync(async (req, res, next) => {
  const { orderId, userId, amount, paymentMethod, paymentStatus } = req.body;

  if (
    !orderId ||
    !userId ||
    amount === undefined ||
    !paymentMethod ||
    !paymentStatus
  ) {
    return next(
      new AppError(
        'Please provide orderId, userId, amount, paymentMethod, and paymentStatus',
        400
      )
    );
  }

  // Verify the user exists
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Verify the order exists
  const order = await prisma.order.findUnique({
    where: { orderId: Number(orderId) },
  });

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  const newPayment = await prisma.payment.create({
    data: {
      orderId: Number(orderId),
      userId: Number(userId),
      amount: Number(amount),
      paymentMethod,
      paymentStatus,
      transactionId: req.body.transactionId || null,
    },
    select: safeFields,
  });

  res.status(201).json({
    status: 'success',
    data: {
      payment: newPayment,
    },
  });
});

exports.getAllPayments = catchAsync(async (req, res, next) => {
  const payments = await prisma.payment.findMany({
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments,
    },
  });
});

exports.getPayment = catchAsync(async (req, res, next) => {
  const payment = await prisma.payment.findUnique({
    where: {
      paymentId: Number(req.params.id),
    },
    select: safeFields,
  });

  if (!payment) {
    return next(new AppError('No payment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment,
    },
  });
});

// Get all payments for a specific user
exports.getPaymentsByUser = catchAsync(async (req, res, next) => {
  const userId = Number(req.params.userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  const payments = await prisma.payment.findMany({
    where: {
      userId: userId,
    },
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments,
    },
  });
});

// Get all payments for a specific order
exports.getPaymentsByOrder = catchAsync(async (req, res, next) => {
  const orderId = Number(req.params.orderId);

  const order = await prisma.order.findUnique({
    where: { orderId: orderId },
  });

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  const payments = await prisma.payment.findMany({
    where: {
      orderId: orderId,
    },
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments,
    },
  });
});

exports.updatePayment = catchAsync(async (req, res, next) => {
  const payment = await prisma.payment.findUnique({
    where: {
      paymentId: Number(req.params.id),
    },
  });

  if (!payment) {
    return next(new AppError('No payment found with that ID', 404));
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      paymentId: Number(req.params.id),
    },
    data: req.body,
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    data: {
      payment: updatedPayment,
    },
  });
});

exports.deletePayment = catchAsync(async (req, res, next) => {
  const payment = await prisma.payment.findUnique({
    where: {
      paymentId: Number(req.params.id),
    },
  });

  if (!payment) {
    return next(new AppError('No payment found with that ID', 404));
  }

  await prisma.payment.delete({
    where: {
      paymentId: Number(req.params.id),
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
