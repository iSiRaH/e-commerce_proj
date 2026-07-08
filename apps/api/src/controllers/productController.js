const catchAsync = require('../utils/catchAsync');
const prisma = require('../config/connectDb');
const AppError = require('../utils/appError');

const safeFields = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  discount: true,
  brand: true,
  category: true,
  sku: true,
  stockQty: true,
  weight: true,
  thumbnail: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, slug, price } = req.body;

  if (!name || !slug || price === undefined) {
    return next(
      new AppError('Please provide name, slug, and price for the product', 400)
    );
  }

  const newProduct = await prisma.product.create({
    data: req.body,
    select: safeFields,
  });

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await prisma.product.findMany({
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: safeFields,
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    data: {
      product: updatedProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  await prisma.product.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
