const express = require('express');
const router = express.Router();
const kiwoomController = require('../controllers/kiwoomController');

/**
 * @swagger
 * /api/kiwoom/token/status:
 *   get:
 *     summary: 토큰 상태 조회
 *     tags: [Kiwoom]
 *     responses:
 *       200:
 *         description: 토큰 상태 조회 성공
 */
router.get('/token/status', kiwoomController.getTokenStatus);

module.exports = router;
