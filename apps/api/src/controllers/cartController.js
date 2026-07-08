const catchAsync = require('../utils/catchAsync');
const prisma = require('../config/connectDb');
const AppError = require('../utils/appError');

const safeFields = {
  id: true,
  name: true,
  products: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      discount: true,
      thumbnail: true,
    },
  },
};

exports.createCart = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError('Please provide a cart name', 400));
  }

  const { productIds, ...cartData } = req.body;

  const createData = { ...cartData };

  // Connect existing products to the cart if productIds are provided
  if (productIds && Array.isArray(productIds)) {
    createData.products = {
      connect: productIds.map((id) => ({ id: Number(id) })),
    };
  }

  const newCart = await prisma.cart.create({
    data: createData,
    select: safeFields,
  });

  res.status(201).json({
    status: 'success',
    data: {
      cart: newCart,
    },
  });
});

exports.getAllCarts = catchAsync(async (req, res, next) => {
  const carts = await prisma.cart.findMany({
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    results: carts.length,
    data: {
      carts,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await prisma.cart.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: safeFields,
  });

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const cart = await prisma.cart.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  const { productIds, ...updateData } = req.body;

  // Handle product connections if provided
  if (productIds && Array.isArray(productIds)) {
    updateData.products = {
      set: productIds.map((id) => ({ id: Number(id) })),
    };
  }

  const updatedCart = await prisma.cart.update({
    where: {
      id: Number(req.params.id),
    },
    data: updateData,
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    data: {
      cart: updatedCart,
    },
  });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const cart = await prisma.cart.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  await prisma.cart.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
