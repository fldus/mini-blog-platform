const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

router.get('/', loginController.getLoginForm);
router.get('/join', loginController.getJoinForm);

module.exports = router;