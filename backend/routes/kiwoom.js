const express = require('express');
const router = express.Router();
const kiwoomController = require('../controllers/kiwoomController');

/**
 * @swagger
 * tags:
 *   name: Kiwoom
 *   description: 키움증권 토큰 관리 API
 */

/**
 * @swagger
 * /api/kiwoom/token/status:
 *   get:
 *     summary: 토큰 상태 조회
 *     description: 현재 활성 토큰과 최근 토큰 이력을 조회합니다
 *     tags: [Kiwoom]
 *     responses:
 *       200:
 *         description: 토큰 상태 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 토큰 상태 조회 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     has_active_token:
 *                       type: boolean
 *                       example: true
 *                       description: 활성 토큰 존재 여부
 *                     active_token:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "uuid-123"
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         expiresDt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-04T08:00:00.000Z"
 *                         createdDt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-03T09:00:00.000Z"
 *                         revokedDt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: null
 *                     recent_tokens:
 *                       type: array
 *                       description: 최근 토큰 이력 (최대 10개)
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           isActive:
 *                             type: boolean
 *                           expiresDt:
 *                             type: string
 *                             format: date-time
 *                           createdDt:
 *                             type: string
 *                             format: date-time
 *                           revokedDt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 토큰 상태 조회 실패
 */
router.get('/token/status', kiwoomController.getTokenStatus);

module.exports = router;
