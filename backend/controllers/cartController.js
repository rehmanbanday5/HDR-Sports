const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Resolves the cart owner filter: logged-in user, or guest via x-guest-id header
const getCartFilter = (req) => {
  if (req.user) return { user: req.user.id };
  const guestId = req.headers['x-guest-id'];
  if (!guestId) return null;
  return { guestId };
};

const findOrCreateCart = async (req) => {
  let filter = getCartFilter(req);
  if (!filter) {
    res.status(400);
    throw new Error('Missing guest identifier. Send x-guest-id header for guest carts.');
  }
  let cart = await Cart.findOne(filter);
  if (!cart) cart = await Cart.create(filter);
  return cart;
};

// @desc    Get current cart
// @route   GET /api/cart
exports.getCart = asyncHandler(async (req, res) => {
  const filter = getCartFilter(req);
  if (!filter) return res.status(200).json({ success: true, cart: { items: [], subtotal: 0 } });

  const cart = await Cart.findOne(filter);
  if (!cart) return res.status(200).json({ success: true, cart: { items: [], subtotal: 0 } });

  res.status(200).json({ success: true, cart: { ...cart.toObject(), subtotal: cart.subtotal() } });
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// body: { productId, variantId?, quantity }
exports.addItem = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  let unitPrice, stock, attributes, image;
  if (product.hasVariants && variantId) {
    const variant = product.variants.id(variantId);
    if (!variant) {
      res.status(404);
      throw new Error('Product variant not found');
    }
    unitPrice = variant.salePrice || variant.price;
    stock = variant.stock;
    attributes = variant.attributes;
  } else {
    unitPrice = product.baseSalePrice || product.basePrice;
    stock = product.stock;
    attributes = {};
  }
  image = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;

  if (stock < quantity) {
    res.status(400);
    throw new Error(`Only ${stock} unit(s) available in stock`);
  }

  const filter = getCartFilter(req);
  if (!filter) {
    res.status(400);
    throw new Error('Missing guest identifier. Send x-guest-id header for guest carts.');
  }

  let cart = await Cart.findOne(filter);
  if (!cart) cart = new Cart(filter);

  const existingItem = cart.items.find(
    (i) => i.product.toString() === productId && String(i.variantId || '') === String(variantId || '')
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: productId,
      variantId: variantId || null,
      name: product.name,
      image,
      attributes,
      price: unitPrice,
      quantity: Number(quantity),
    });
  }

  await cart.save();
  res.status(200).json({ success: true, cart: { ...cart.toObject(), subtotal: cart.subtotal() } });
});

// @desc    Update item quantity
// @route   PUT /api/cart/items/:itemId
exports.updateItemQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const filter = getCartFilter(req);
  const cart = await Cart.findOne(filter);
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  if (quantity <= 0) {
    cart.items.pull(req.params.itemId);
  } else {
    item.quantity = Number(quantity);
  }

  await cart.save();
  res.status(200).json({ success: true, cart: { ...cart.toObject(), subtotal: cart.subtotal() } });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
exports.removeItem = asyncHandler(async (req, res) => {
  const filter = getCartFilter(req);
  const cart = await Cart.findOne(filter);
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  cart.items.pull(req.params.itemId);
  await cart.save();
  res.status(200).json({ success: true, cart: { ...cart.toObject(), subtotal: cart.subtotal() } });
});

// @desc    Clear cart
// @route   DELETE /api/cart
exports.clearCart = asyncHandler(async (req, res) => {
  const filter = getCartFilter(req);
  await Cart.findOneAndUpdate(filter, { items: [] });
  res.status(200).json({ success: true, message: 'Cart cleared' });
});

// @desc    Merge guest cart into user cart after login
// @route   POST /api/cart/merge
exports.mergeGuestCart = asyncHandler(async (req, res) => {
  const guestId = req.headers['x-guest-id'];
  if (!guestId) return res.status(200).json({ success: true, message: 'No guest cart to merge' });

  const guestCart = await Cart.findOne({ guestId });
  if (!guestCart || guestCart.items.length === 0) {
    return res.status(200).json({ success: true, message: 'No guest cart to merge' });
  }

  let userCart = await Cart.findOne({ user: req.user.id });
  if (!userCart) userCart = new Cart({ user: req.user.id, items: [] });

  guestCart.items.forEach((gItem) => {
    const existing = userCart.items.find(
      (i) => i.product.toString() === gItem.product.toString() && String(i.variantId || '') === String(gItem.variantId || '')
    );
    if (existing) {
      existing.quantity += gItem.quantity;
    } else {
      userCart.items.push(gItem);
    }
  });

  await userCart.save();
  await Cart.deleteOne({ _id: guestCart._id });

  res.status(200).json({ success: true, cart: { ...userCart.toObject(), subtotal: userCart.subtotal() } });
});
