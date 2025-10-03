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
 *     description: 키움증권 API 연동 상태를 확인합니다
 *     tags: [Kiwoom]
 *     responses:
 *       200:
 *         description: 연동 상태 조회 성공
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
 *                     is_connected:
 *                       type: boolean
 *                       example: true
 *                       description: 키움증권 연동 상태 (true=연결됨, false=끊김)
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
