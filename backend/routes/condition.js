const express = require('express');
const router = express.Router();
const conditionController = require('../controllers/conditionController');

router.get('/list', conditionController.getConditionList);

module.exports = router;
