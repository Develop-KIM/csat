const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

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
router.get('/token/status', tokenController.getTokenStatus);

/**
 * @swagger
 * /api/kiwoom/tokens/refresh/status:
 *   get:
 *     summary: 토큰 재발급 스케줄러 상태 조회
 *     tags: [Kiwoom]
 */
router.get('/token/refresh/status', tokenController.getTokenRefreshStatus);

/**
 * @swagger
 * /api/kiwoom/tokens/cleanup/status:
 *   get:
 *     summary: 토큰 정리 스케줄러 상태 조회
 *     tags: [Kiwoom]
 */
router.get('/tokens/cleanup/status', tokenController.getCleanupStatus);

/**
 * @swagger
 * /api/kiwoom/scheduler/status/stream:
 *   get:
 *     summary: 스케줄러 상태 실시간 스트림 (SSE)
 *     tags: [Kiwoom]
 */
router.get('/scheduler/status/stream', tokenController.streamSchedulerStatus);

module.exports = router;
