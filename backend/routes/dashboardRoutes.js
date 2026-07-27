const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('admin'));
router.get('/summary', ctrl.getDashboardSummary);

module.exports = router;
