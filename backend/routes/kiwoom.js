const express = require('express');
const router = express.Router();
const kiwoomController = require('../controllers/KiwoomController');

router.post('/token', kiwoomController.getToken);

module.exports = router;
