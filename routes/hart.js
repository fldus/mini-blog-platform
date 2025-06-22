const express = require('express');
const hartController = require('../controllers/hartController');
const router = express.Router();

router.post('/:post_id', hartController.click);

module.exports = router;