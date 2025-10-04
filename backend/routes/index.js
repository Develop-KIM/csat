const express = require('express');
const router = express.Router();

router.use('/kiwoom', require('./token'));
router.use('/portfolio', require('./portfolio'));

module.exports = router;
