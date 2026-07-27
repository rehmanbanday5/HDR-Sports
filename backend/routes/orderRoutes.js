const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { protect, optionalAuth, restrictTo } = require('../middleware/auth');
const { validate, orderRules } = require('../middleware/validators');

router.post('/shipping-options', ctrl.getShippingOptions);
router.post('/', optionalAuth, orderRules, validate, ctrl.createOrder);
router.get('/lookup', ctrl.lookupOrder);

router.get('/', protect, restrictTo('admin'), ctrl.getAllOrders);
router.get('/:id', protect, restrictTo('admin'), ctrl.getOrderById);
router.put('/:id/status', protect, restrictTo('admin'), ctrl.updateOrderStatus);
router.put('/:id/payment-status', protect, restrictTo('admin'), ctrl.updatePaymentStatus);

module.exports = router;
