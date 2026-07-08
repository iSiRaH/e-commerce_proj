const catchAsync = require('../utils/catchAsync');
const prisma = require('../config/connectDb');
const AppError = require('../utils/appError');

const safeFields = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return next(new AppError('Please provide name and slug', 400));
  }

  // Check for duplicate slug
  const existing = await prisma.category.findUnique({
    where: { slug },
  });

  if (existing) {
    return next(new AppError('A category with this slug already exists', 409));
  }

  const newCategory = await prisma.category.create({
    data: {
      name,
      slug,
      description: req.body.description || null,
      image: req.body.image || null,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    },
    select: safeFields,
  });

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await prisma.category.findMany({
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await prisma.category.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: safeFields,
  });

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});

exports.getCategoryBySlug = catchAsync(async (req, res, next) => {
  const category = await prisma.category.findUnique({
    where: {
      slug: req.params.slug,
    },
    select: safeFields,
  });

  if (!category) {
    return next(new AppError('No category found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await prisma.category.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  // If slug is being updated, check for duplicates
  if (req.body.slug && req.body.slug !== category.slug) {
    const existing = await prisma.category.findUnique({
      where: { slug: req.body.slug },
    });

    if (existing) {
      return next(
        new AppError('A category with this slug already exists', 409)
      );
    }
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
    select: safeFields,
  });

  res.status(200).json({
    status: 'success',
    data: {
      category: updatedCategory,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await prisma.category.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  await prisma.category.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
