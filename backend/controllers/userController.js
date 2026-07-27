const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Update own profile
// @route   PUT /api/users/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, user });
});

// @desc    Add address
// @route   POST /api/users/addresses
exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
exports.updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  Object.assign(address, req.body);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.pull(req.params.addressId);
  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Get own order history
// @route   GET /api/users/orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get single own order
// @route   GET /api/users/orders/:id
exports.getMyOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.status(200).json({ success: true, order });
});

// ---------- Admin ----------

// @desc    Get all customers (admin)
// @route   GET /api/users
exports.getAllCustomers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const filter = { role: 'customer' };
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [customers, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, count: customers.length, total, page, pages: Math.ceil(total / limit), customers });
});

// @desc    Get single customer with order history (admin)
// @route   GET /api/users/:id
exports.getCustomerById = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.id).select('-password');
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }
  const orders = await Order.find({ user: customer._id }).sort('-createdAt');
  res.status(200).json({ success: true, customer, orders });
});

// @desc    Toggle customer active status (admin)
// @route   PUT /api/users/:id/status
exports.toggleCustomerStatus = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }
  customer.isActive = !customer.isActive;
  await customer.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, customer });
});
