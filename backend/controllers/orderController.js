const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { generateOrderNumber, findShippingOption } = require('../utils/orderHelpers');
const {
  sendAdminNewOrderEmail,
  sendOrderStatusUpdateEmail,
} = require("../utils/email");

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    orders,
  });
});

// @desc    Get available shipping options for an address
// @route   POST /api/orders/shipping-options
// body: { country, subtotal }
exports.getShippingOptions = asyncHandler(async (req, res) => {
  const { country, subtotal = 0 } = req.body;
  const isInternational = country && country.toLowerCase() !== 'pakistan';
  const { getShippingOptions } = require('../utils/orderHelpers');
  const options = getShippingOptions(isInternational, Number(subtotal));
  res.status(200).json({ success: true, isInternational, options });
});

// @desc    Place an order (checkout) — works for logged-in and guest users
// @route   POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const { customer, shippingAddress, orderNotes, items, shippingMethodId, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Cannot place an order with no items');
  }

  const isInternational = shippingAddress.country && shippingAddress.country.toLowerCase() !== 'pakistan';
  if (isInternational && paymentMethod === 'cod') {
    res.status(400);
    throw new Error('Cash on Delivery is not available for international orders');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderItems = [];
    let subtotal = 0;

    for (const reqItem of items) {
      const product = await Product.findById(reqItem.productId).session(
        session,
      );
      if (!product || !product.isActive) {
        throw new Error(
          `Product not found or unavailable: ${reqItem.productId}`,
        );
      }

      let unitPrice, availableStock, attributes, sku;

      if (product.hasVariants && reqItem.variantId) {
        const variant = product.variants.id(reqItem.variantId);
        if (!variant)
          throw new Error(`Variant not found for product ${product.name}`);
        if (variant.stock < reqItem.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name} (${Object.values(variant.attributes || {}).join(", ")})`,
          );
        }
        variant.stock -= reqItem.quantity;
        unitPrice = variant.salePrice || variant.price;
        attributes = variant.attributes;
        sku = variant.sku;
      } else {
        if (product.stock < reqItem.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        product.stock -= reqItem.quantity;
        unitPrice = product.baseSalePrice || product.basePrice;
        attributes = {};
        sku = product.sku;
      }

      await product.save({ session });

      const lineTotal = unitPrice * reqItem.quantity;
      subtotal += lineTotal;

      orderItems.push({
        product: product._id,
        variantId: reqItem.variantId || null,
        name: product.name,
        image:
          product.images.find((i) => i.isPrimary)?.url ||
          product.images[0]?.url,
        attributes,
        sku,
        unitPrice,
        quantity: reqItem.quantity,
        lineTotal,
      });
    }

    const shippingOption = findShippingOption(
      isInternational,
      shippingMethodId,
      subtotal,
    );
    const total = subtotal + shippingOption.cost;

    const orderNumber = await generateOrderNumber();

    const order = new Order({
      orderNumber,
      user: req.user ? req.user.id : null,
      items: orderItems,
      customer,
      shippingAddress: { ...shippingAddress, isInternational },
      orderNotes,
      shippingMethod: {
        name: shippingOption.name,
        cost: shippingOption.cost,
        estimatedDays: shippingOption.estimatedDays,
      },
      pricing: {
        subtotal,
        shippingCost: shippingOption.cost,
        discount: 0,
        tax: 0,
        total,
        currency: "PKR",
      },
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "pending",
      status: "pending",
      isInternationalOrder: isInternational,
    });

    await order.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Clear cart (best effort, outside transaction)
    const cartFilter = req.user
      ? { user: req.user.id }
      : req.headers["x-guest-id"]
        ? { guestId: req.headers["x-guest-id"] }
        : null;
    if (cartFilter) await Cart.findOneAndUpdate(cartFilter, { items: [] });

    // Fire-and-forget notification emails — do not block the response on email delivery
   
    // sendAdminNewOrderEmail(order).catch((e) =>
    //   console.error("[email] admin notify failed:", e.message),
    // );


    sendAdminNewOrderEmail(order)
      .then(() => console.log("EMAIL SENT SUCCESS"))
      .catch((e) => console.error("EMAIL ERROR:", e));

      
    res.status(201).json({ success: true, order });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();

    res.status(400);
    throw err;
  }
});

// @desc    Get order by order number + email (guest order lookup / confirmation page)
// @route   GET /api/orders/lookup?orderNumber=&email=
exports.lookupOrder = asyncHandler(async (req, res) => {
  const { orderNumber, email } = req.query;
  const order = await Order.findOne({ orderNumber, 'customer.email': email.toLowerCase() });
  if (!order) {
    res.status(404);
    throw new Error('Order not found. Check your order number and email.');
  }
  res.status(200).json({ success: true, order });
});

// ---------- Admin ----------

// @desc    Get all orders (admin) — search + filter
// @route   GET /api/orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, paymentStatus, search, isInternational, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (isInternational !== undefined) filter.isInternationalOrder = isInternational === 'true';
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customer.email': { $regex: search, $options: 'i' } },
      { 'customer.fullName': { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = parseInt(limit) || 20;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, count: orders.length, total, page: pageNum, pages: Math.ceil(total / limitNum), orders });
});

// @desc    Get single order (admin)
// @route   GET /api/orders/:id
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.status(200).json({ success: true, order });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  order.statusHistory.push({ status, note });
  if (status === 'delivered') {
    order.deliveredAt = Date.now();
    // bump salesCount on each product
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { salesCount: item.quantity } });
    }
  }
  if (status === 'cancelled') {
    order.cancelledReason = note;
    // restock items
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      if (product.hasVariants && item.variantId) {
        const variant = product.variants.id(item.variantId);
        if (variant) variant.stock += item.quantity;
      } else {
        product.stock += item.quantity;
      }
      await product.save({ validateBeforeSave: false });
    }
  }

  await order.save();
  sendOrderStatusUpdateEmail(order).catch((e) => console.error('[email] status update failed:', e.message));

  res.status(200).json({ success: true, order });
});

// @desc    Update payment status (admin)
// @route   PUT /api/orders/:id/payment-status
exports.updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, transactionId } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.paymentStatus = paymentStatus;
  if (transactionId) order.paymentDetails.transactionId = transactionId;
  if (paymentStatus === 'paid') order.paymentDetails.paidAt = Date.now();
  await order.save();
  res.status(200).json({ success: true, order });
});
