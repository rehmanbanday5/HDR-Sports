const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.put('/profile', ctrl.updateProfile);
router.post('/addresses', ctrl.addAddress);
router.put('/addresses/:addressId', ctrl.updateAddress);
router.delete('/addresses/:addressId', ctrl.deleteAddress);
router.get('/orders', ctrl.getMyOrders);
router.get('/orders/:id', ctrl.getMyOrderById);

// Admin only
router.get('/', restrictTo('admin'), ctrl.getAllCustomers);
router.get('/:id', restrictTo('admin'), ctrl.getCustomerById);
router.put('/:id/status', restrictTo('admin'), ctrl.toggleCustomerStatus);

module.exports = router;
