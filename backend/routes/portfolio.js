const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

/**
 * @swagger
 * /api/portfolio/deposit:
 *   get:
 *     summary: 예수금상세현황 조회
 *     description: 현재 사용하지 않습니다.
 *     tags: [Portfolio]
 */
router.get('/deposit', portfolioController.getDepositDetail);

/**
 * @swagger
 * /api/portfolio/balance:
 *   get:
 *     summary: 계좌평가잔고내역 조회
 *     description: 현재 사용하지 않습니다.
 *     tags: [Portfolio]
 */
router.get('/balance', portfolioController.getAccountBalance);

/**
 * @swagger
 * /api/portfolio/dashboard:
 *   get:
 *     summary: 대시보드 통합 데이터 조회 (예수금 + 계좌평가잔고)
 *     tags: [Portfolio]
 */
router.get('/dashboard', portfolioController.getDashboard);

module.exports = router;
