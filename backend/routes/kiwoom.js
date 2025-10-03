const express = require('express');
const router = express.Router();
const kiwoomController = require('../controllers/kiwoomController');

/**
 * @swagger
 * tags:
 *   name: Kiwoom
 *   description: 키움증권 토큰 관리 API
 */

router.post('/token', kiwoomController.getToken);

router.delete('/token/revoke', kiwoomController.revokeToken);

module.exports = router;
