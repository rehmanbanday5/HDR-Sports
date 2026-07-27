const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', ctrl.getCategories);
router.get('/:slug', ctrl.getCategoryBySlug);

router.post('/', protect, restrictTo('admin'), upload.single('image'), ctrl.createCategory);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), ctrl.updateCategory);
router.delete('/:id', protect, restrictTo('admin'), ctrl.deleteCategory);

module.exports = router;
