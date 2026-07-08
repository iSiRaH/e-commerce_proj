const catchAsync = require('../utils/catchAsync');
const prisma = require('../config/connectDb');
const AppError = require('../utils/appError');

const safeFields = {
  orderId: true,
  userId: true,
  orderItems: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      discount: true,
      thumbnail: true,
    },
  },
  totalAmount: true,
  discount: true,
  tax: true,
  shippingAddress: true,
  billingAddress: true,
  shippingMethod: true,
  paymentMethod: true,
  paymentStatus: true,
  orderStatus: true,
  shippingCost: true,
  subtotal: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const { userId, totalAmount, subtotal, orderStatus, status } = req.body;

  if (
    !userId ||
    totalAmount === undefined ||
    subtotal === undefined ||
    !orderStatus ||
    !status
  ) {
    return next(
      new AppError(
        'Please provide userId, totalAmount, subtotal, orderStatus, and status',
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

  // Extract product IDs to connect if provided
  const { productIds, ...orderData } = req.body;

  const createData = {
    ...orderData,
    userId: Number(userId),
  };

  // Connect existing products to the order if productIds are provided
  if (productIds && Array.isArray(productIds)) {
    createData.orderItems = {
      connect: productIds.map((id) => ({ id: Number(id) })),
    };
  }

  const newOrder = await prisma.order.create({
    data: createData,
    select: safeFields,
  });

  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder,
    },
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await prisma.order.findMany({
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await prisma.order.findUnique({
    where: {
      orderId: Number(req.params.id),
    },
    select: safeFields,
  });

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// Get all orders for a specific user
exports.getOrdersByUser = catchAsync(async (req, res, next) => {
  const userId = Number(req.params.userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await prisma.order.findUnique({
    where: {
      orderId: Number(req.params.id),
    },
  });

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  const { productIds, ...updateData } = req.body;

  // Handle product connections if provided
  if (productIds && Array.isArray(productIds)) {
    updateData.orderItems = {
      set: productIds.map((id) => ({ id: Number(id) })),
    };
  }

  const updatedOrder = await prisma.order.update({
    where: {
      orderId: Number(req.params.id),
    },
    data: updateData,
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await prisma.order.findUnique({
    where: {
      orderId: Number(req.params.id),
    },
  });

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  await prisma.order.delete({
    where: {
      orderId: Number(req.params.id),
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
