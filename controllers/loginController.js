const user = require('../models/user');

const loginController = {
  // 로그인 폼
  getLoginForm: (req, res) => {
    res.render('login');
  },
  getJoinForm: (req, res) => {
    res.render('join');
  }
}

module.exports = loginController;