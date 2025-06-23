const express = require('express');
const loginController = require('../controllers/loginController');
const mypageController = require('../controllers/mypageController');
const router = express.Router();

router.get('/', mypageController.getMypage);
router.post('/edit', mypageController.editUsername);

module.exports = router;