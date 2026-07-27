const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cartController');
const { optionalAuth, protect } = require('../middleware/auth');

router.use(optionalAuth);

router.get('/', ctrl.getCart);
router.post('/items', ctrl.addItem);
router.put('/items/:itemId', ctrl.updateItemQuantity);
router.delete('/items/:itemId', ctrl.removeItem);
router.delete('/', ctrl.clearCart);
router.post('/merge', protect, ctrl.mergeGuestCart);

module.exports = router;
