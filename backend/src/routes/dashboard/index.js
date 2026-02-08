const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { getDashboardSummary, getAnalytics } = require('../../controllers/dashboard');

const router = express.Router();

router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/analytics', authMiddleware, getAnalytics);

module.exports = router;
