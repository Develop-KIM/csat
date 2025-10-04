const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

/**
 * @swagger
 * /api/portfolio/deposit:
 *   get:
 *     summary: 예수금상세현황 조회
 *     tags: [Portfolio]
 */
router.get('/deposit', portfolioController.getDepositDetail);

module.exports = router;
