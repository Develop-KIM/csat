const express = require('express');
const router = express.Router();

router.use('/kiwoom', require('./token'));
router.use('/portfolio', require('./portfolio'));
router.use('/condition', require('./condition'));

module.exports = router;
