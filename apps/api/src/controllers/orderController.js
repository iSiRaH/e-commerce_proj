const catchAsync = require('../utils/catchAsync');
const prisma = require('../config/connectDb');
const AppError = require('../utils/appError');

const safeFields = {
  orderId: true,
  userId: true,
  orderItems: {
    select: {
      id: true,
      quantity: true,
      price: true,
      discount: true,
      total: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
        },
      },
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

  // Extract product IDs or order items to connect if provided
  const { productIds, orderItems, ...orderData } = req.body;

  const createData = {
    ...orderData,
    userId: Number(userId),
  };

  if (orderItems && Array.isArray(orderItems)) {
    createData.orderItems = {
      create: orderItems.map((item) => ({
        productId: Number(item.productId || item.id),
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
        discount: item.discount !== undefined ? Number(item.discount) : 0,
        total: Number(item.total || (item.quantity || 1) * (item.price || 0)),
      })),
    };
  } else if (productIds && Array.isArray(productIds)) {
    // Fallback: Fetch product details to construct OrderItems
    const products = await prisma.product.findMany({
      where: { id: { in: productIds.map(Number) } },
    });
    createData.orderItems = {
      create: products.map((product) => ({
        productId: product.id,
        quantity: 1,
        price: product.price,
        discount: product.discount || 0,
        total: product.price - (product.discount || 0),
      })),
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

  const { productIds, orderItems, ...updateData } = req.body;

  // Handle product connections if provided
  if (orderItems && Array.isArray(orderItems)) {
    // Delete existing order items and create new ones
    await prisma.orderItem.deleteMany({
      where: { orderId: Number(req.params.id) },
    });

    updateData.orderItems = {
      create: orderItems.map((item) => ({
        productId: Number(item.productId || item.id),
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
        discount: item.discount !== undefined ? Number(item.discount) : 0,
        total: Number(item.total || (item.quantity || 1) * (item.price || 0)),
      })),
    };
  } else if (productIds && Array.isArray(productIds)) {
    await prisma.orderItem.deleteMany({
      where: { orderId: Number(req.params.id) },
    });

    const products = await prisma.product.findMany({
      where: { id: { in: productIds.map(Number) } },
    });

    updateData.orderItems = {
      create: products.map((product) => ({
        productId: product.id,
        quantity: 1,
        price: product.price,
        discount: product.discount || 0,
        total: product.price - (product.discount || 0),
      })),
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
