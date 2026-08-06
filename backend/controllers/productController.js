const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require("../models/Category");
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Browse/search/filter/sort products
// @route   GET /api/products
// query params: search, category, minPrice, maxPrice, sort, page, limit, featured, newArrival, bestSeller, inStock
exports.getProducts = asyncHandler(async (req, res) => {
  const Category = require("../models/Category");

  const {
    search,
    category,
    categorySlug,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
    featured,
    newArrival,
    bestSeller,
    inStock,
  } = req.query;

  const filter = { isActive: true };

  if (search) filter.$text = { $search: search };
if (category) {
  filter.category = category;
}

if (categorySlug) {
  const cat = await Category.findOne({ slug: categorySlug });

  if (cat) {
    filter.category = cat._id;
  } else {
    filter.category = null;
  }
}  if (featured === 'true') filter.isFeatured = true;
  if (newArrival === 'true') filter.isNewArrival = true;
  if (bestSeller === 'true') filter.isBestSeller = true;

  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
  }

  if (inStock === 'true') filter.stock = { $gt: 0 };

  const sortMap = {
    'price-asc': { basePrice: 1 },
    'price-desc': { basePrice: -1 },
    newest: { createdAt: -1 },
    rating: { ratingAverage: -1 },
    popular: { salesCount: -1 },
    name: { name: 1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(parseInt(limit) || 12, 60);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('relatedProducts', 'name slug images basePrice baseSalePrice ratingAverage');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.viewCount += 1;
  await product.save({ validateBeforeSave: false });

  // Fallback related products: same category, excluding self
  let related = product.relatedProducts;
  if (!related || related.length === 0) {
    related = await Product.find({ category: product.category._id, _id: { $ne: product._id }, isActive: true })
      .select('name slug images basePrice baseSalePrice ratingAverage')
      .limit(4);
  }

  res.status(200).json({ success: true, product, relatedProducts: related });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user.id);
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  product.reviews.push({ user: req.user.id, name: req.user.name, rating: Number(rating), comment });
  product.recalculateRating();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added' });
});

// ---------- Admin ----------

// @desc    Create product (admin)
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  if (typeof body.variants === 'string') body.variants = JSON.parse(body.variants);
  if (typeof body.specifications === 'string') body.specifications = JSON.parse(body.specifications);
  if (typeof body.tags === 'string') body.tags = body.tags.split(',').map((t) => t.trim());

  const product = new Product(body);

  if (req.files?.length) {
    const uploads = await Promise.all(
      req.files.map((f) => uploadToCloudinary(`data:${f.mimetype};base64,${f.buffer.toString('base64')}`))
    );
    product.images = uploads.map((r, idx) => ({ url: r.secure_url, publicId: r.public_id, isPrimary: idx === 0 }));
  }

  await product.save();
  res.status(201).json({ success: true, product });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const body = { ...req.body };
  if (typeof body.variants === 'string') body.variants = JSON.parse(body.variants);
  if (typeof body.specifications === 'string') body.specifications = JSON.parse(body.specifications);
  if (typeof body.tags === 'string') body.tags = body.tags.split(',').map((t) => t.trim());

  Object.assign(product, body);

  if (req.files?.length) {
    const uploads = await Promise.all(
      req.files.map((f) => uploadToCloudinary(`data:${f.mimetype};base64,${f.buffer.toString('base64')}`))
    );
    const newImages = uploads.map((r) => ({ url: r.secure_url, publicId: r.public_id, isPrimary: false }));
    product.images = [...product.images, ...newImages];
  }

  await product.save();
  res.status(200).json({ success: true, product });
});

// @desc    Delete a single product image (admin)
// @route   DELETE /api/products/:id/images/:imageId
exports.deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const image = product.images.id(req.params.imageId);
  if (!image) {
    res.status(404);
    throw new Error('Image not found');
  }
  if (image.publicId) await deleteFromCloudinary(image.publicId);
  product.images.pull(req.params.imageId);
  await product.save();
  res.status(200).json({ success: true, images: product.images });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await Promise.all(product.images.filter((i) => i.publicId).map((i) => deleteFromCloudinary(i.publicId)));
  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted' });
});

// @desc    Get all products for admin (includes inactive, no pagination limit cap)
// @route   GET /api/products/admin/all
exports.getAdminProducts = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = parseInt(limit) || 20;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, count: products.length, total, page: pageNum, pages: Math.ceil(total / limitNum), products });
});

// @desc    Low stock products (admin)
// @route   GET /api/products/admin/low-stock
exports.getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 5;
  const products = await Product.find({
    isActive: true,
    $or: [
      { hasVariants: false, stock: { $lte: threshold } },
      { hasVariants: true, 'variants.stock': { $lte: threshold } },
    ],
  }).select('name slug stock variants images');
  res.status(200).json({ success: true, count: products.length, products });
});
