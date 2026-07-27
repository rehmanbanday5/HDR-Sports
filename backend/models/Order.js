const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
    name: { type: String, required: true },
    image: { type: String },
    attributes: { type: Map, of: String, default: {} },
    sku: { type: String },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: true }
);

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['unpaid', 'pending', 'paid', 'failed', 'refunded'];
const PAYMENT_METHODS = ['cod', 'bank_transfer', 'stripe', 'jazzcash', 'easypaisa'];

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    note: { type: String },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null for guest checkout

    items: [orderItemSchema],

    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    shippingAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      isInternational: { type: Boolean, required: true, default: false },
    },

    orderNotes: { type: String, maxlength: 500 },

    shippingMethod: {
      name: { type: String, required: true }, // e.g. "Standard Local (TCS)", "International Express (DHL)"
      cost: { type: Number, required: true, min: 0 },
      estimatedDays: { type: String },
    },

    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      shippingCost: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'PKR' },
    },

    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'unpaid' },
    paymentDetails: {
      transactionId: { type: String },
      paidAt: { type: Date },
      gatewayResponse: { type: mongoose.Schema.Types.Mixed },
    },

    status: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    statusHistory: [statusHistorySchema],

    isInternationalOrder: { type: Boolean, default: false },

    cancelledReason: { type: String },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

orderSchema.set('toJSON', { flattenMaps: true });
orderSchema.set('toObject', { flattenMaps: true });
orderItemSchema.set('toJSON', { flattenMaps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'customer.email': 1 });

orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({ status: this.status, note: 'Order placed' });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
module.exports.PAYMENT_STATUSES = PAYMENT_STATUSES;
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
