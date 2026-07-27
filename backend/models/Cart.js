const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
    name: { type: String, required: true },
    image: { type: String },
    attributes: { type: Map, of: String, default: {} },
    price: { type: Number, required: true }, // unit price snapshot at add-time
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestId: { type: String, default: null, index: true }, // for guest carts via cookie/localStorage id
    items: [cartItemSchema],
  },
  { timestamps: true }
);

cartSchema.set('toJSON', { flattenMaps: true });
cartSchema.set('toObject', { flattenMaps: true });
cartItemSchema.set('toJSON', { flattenMaps: true });

cartSchema.methods.subtotal = function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
