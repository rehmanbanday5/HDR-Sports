const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.includeInactive ? {} : { isActive: true };
  const categories = await Category.find(filter).sort('displayOrder name');
  res.status(200).json({ success: true, count: categories.length, categories });
});

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.status(200).json({ success: true, category });
});

// @desc    Create category (admin)
// @route   POST /api/categories
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, parent, displayOrder } = req.body;
  const category = new Category({ name, description, parent: parent || null, displayOrder });

  if (req.file) {
    const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await uploadToCloudinary(b64, 'HDR/categories');
    category.image = { url: result.secure_url, publicId: result.public_id };
  }

  await category.save();
  res.status(201).json({ success: true, category });
});

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  Object.assign(category, req.body);

  if (req.file) {
    if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
    const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await uploadToCloudinary(b64, 'HDR/categories');
    category.image = { url: result.secure_url, publicId: result.public_id };
  }

  await category.save();
  res.status(200).json({ success: true, category });
});

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
exports.deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ category: req.params.id });
  if (inUse > 0) {
    res.status(400);
    throw new Error(`Cannot delete category: ${inUse} product(s) still reference it`);
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
  res.status(200).json({ success: true, message: 'Category deleted' });
});
