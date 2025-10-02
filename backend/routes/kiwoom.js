const express = require('express');
const router = express.Router();
const kiwoomController = require('../controllers/kiwoomController');

router.post('/token', kiwoomController.getToken);
router.delete('/token/revoke', kiwoomController.revokeToken);

module.exports = router;
