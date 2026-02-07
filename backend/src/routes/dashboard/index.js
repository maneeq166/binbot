const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { getDashboardSummary } = require('../../controllers/dashboard');

const router = express.Router();

router.get('/summary', authMiddleware, getDashboardSummary);

module.exports = router;
