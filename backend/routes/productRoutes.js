const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validate, productRules } = require('../middleware/validators');

router.get('/admin/all', protect, restrictTo('admin'), ctrl.getAdminProducts);
router.get('/admin/low-stock', protect, restrictTo('admin'), ctrl.getLowStockProducts);

router.get('/', ctrl.getProducts);
router.get('/:slug', ctrl.getProductBySlug);
router.post('/:id/reviews', protect, ctrl.addReview);

router.post('/', protect, restrictTo('admin'), upload.array('images', 10), productRules, validate, ctrl.createProduct);
router.put('/:id', protect, restrictTo('admin'), upload.array('images', 10), ctrl.updateProduct);
router.delete('/:id/images/:imageId', protect, restrictTo('admin'), ctrl.deleteProductImage);
router.delete('/:id', protect, restrictTo('admin'), ctrl.deleteProduct);

module.exports = router;
