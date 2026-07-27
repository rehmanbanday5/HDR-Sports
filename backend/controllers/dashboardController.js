const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Admin dashboard summary stats
// @route   GET /api/dashboard/summary
exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalCustomers,
    salesAgg,
    recentOrders,
    topProducts,
    lowStockCount,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'processing' }),
    Order.countDocuments({ status: 'shipped' }),
    Order.countDocuments({ status: 'delivered' }),
    Order.countDocuments({ status: 'cancelled' }),
    User.countDocuments({ role: 'customer' }),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$pricing.total' } } },
    ]),
    Order.find().sort('-createdAt').limit(8).select('orderNumber customer.fullName status pricing.total createdAt'),
    Product.find({ isActive: true }).sort('-salesCount').limit(5).select('name slug salesCount images'),
    Product.countDocuments({
      isActive: true,
      $or: [{ hasVariants: false, stock: { $lte: 5 } }, { hasVariants: true, 'variants.stock': { $lte: 5 } }],
    }),
  ]);

  // Sales over last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const salesByDay = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        total: { $sum: '$pricing.total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      totalSales: salesAgg[0]?.totalSales || 0,
      lowStockCount,
    },
    recentOrders,
    topProducts,
    salesByDay,
  });
});
