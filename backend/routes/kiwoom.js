const express = require('express');
const router = express.Router();
const kiwoomController = require('../controllers/kiwoomController');

/**
 * @swagger
 * tags:
 *   name: Kiwoom
 *   description: 키움증권 연동 상태 API
 */

/**
 * @swagger
 * /api/kiwoom/token/status:
 *   get:
 *     summary: 키움 연동 상태 조회
 *     tags: [Kiwoom]
 */
router.get('/token/status', kiwoomController.getTokenStatus);

/**
 * @swagger
 * /api/kiwoom/tokens/refresh/status:
 *   get:
 *     summary: 토큰 재발급 스케줄러 상태 조회
 *     tags: [Kiwoom]
 */
// router.get('/token/refresh/status', kiwoomController.getTokenRefreshStatus);

/**
 * @swagger
 * /api/kiwoom/tokens/cleanup/status:
 *   get:
 *     summary: 토큰 정리 스케줄러 상태 조회
 *     tags: [Kiwoom]
 */
router.get('/tokens/cleanup/status', kiwoomController.getCleanupStatus);

module.exports = router;
