const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

router.get('/', loginController.getLoginForm);
router.post('/', loginController.login);
router.get('/logout', loginController.logout);
router.get('/join', loginController.getJoinForm);
router.post('/join', loginController.Join);

module.exports = router;