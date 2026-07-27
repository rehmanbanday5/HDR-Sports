const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema(
  {
    // e.g. { size: 'SH (Short Handle)', weight: '2lb 9oz', color: 'Natural' }
    attributes: { type: Map, of: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: true },
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: true }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 150 },
    slug: { type: String, unique: true, index: true },
    brand: { type: String, default: 'GULLY', trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: String, trim: true }, // e.g. "English Willow Bats"
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300 },
    specifications: { type: Map, of: String, default: {} }, // e.g. willow grade, material, weight range

    // Base price shown before variant selection (min variant price is source of truth if variants exist)
    basePrice: { type: Number, required: true, min: 0 },
    baseSalePrice: { type: Number, min: 0, default: null },

    hasVariants: { type: Boolean, default: false },
    variants: [variantSchema],
    // simple stock/sku used when hasVariants is false
    sku: { type: String, unique: true, sparse: true },
    stock: { type: Number, default: 0, min: 0 },

    images: [imageSchema],

    tags: [{ type: String, trim: true, lowercase: true }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // visibility toggle

    weightGrams: { type: Number }, // for shipping calc
    dimensions: { length: Number, width: Number, height: Number },

    reviews: [reviewSchema],
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },

    salesCount: { type: Number, default: 0 }, // incremented on delivered orders
    viewCount: { type: Number, default: 0 },

    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

productSchema.set('toJSON', { flattenMaps: true });
productSchema.set('toObject', { flattenMaps: true });
variantSchema.set('toJSON', { flattenMaps: true });
variantSchema.set('toObject', { flattenMaps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNewArrival: 1 });

productSchema.pre('validate', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(2, 7);
  }
  next();
});

// Virtual: effective min price across variants (or base)
productSchema.methods.getDisplayPrice = function () {
  if (this.hasVariants && this.variants.length) {
    const prices = this.variants.map((v) => v.salePrice || v.price);
    return Math.min(...prices);
  }
  return this.baseSalePrice || this.basePrice;
};

productSchema.methods.getTotalStock = function () {
  if (this.hasVariants && this.variants.length) {
    return this.variants.reduce((sum, v) => sum + v.stock, 0);
  }
  return this.stock;
};

productSchema.methods.recalculateRating = function () {
  if (!this.reviews.length) {
    this.ratingAverage = 0;
    this.ratingCount = 0;
    return;
  }
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  this.ratingAverage = Math.round((sum / this.reviews.length) * 10) / 10;
  this.ratingCount = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
