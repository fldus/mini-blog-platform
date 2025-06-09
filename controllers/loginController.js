const user = require('../models/user');
const bcrypt = require('bcrypt');

const loginController = {
  // 로그인 폼
  getLoginForm: (req, res) => {
    res.render('login');
  },
  login: async(req, res) => {
    const {user_id, password} = req.body;

    try{
      const login = await user.findOne({where : {user_id}});
      if(!login){
        return res.status(401).send('존재하지 않는 사용자입니다.');
      }

      const match = await bcrypt.compare(password, login.password);
      if(!match){
        return res.status(401).send('비밀번호가 일치하지 않습니다.');
      }

      req.session.user = {
        id: login.id,
        user_id: login.user_id,
        username: login.username
      };

      res.redirect('/')
    }catch(err){
      console.error('로그인 실패', err);
      res.status(500).send('로그인 실패')
    }
  },
  getJoinForm: (req, res) => {
    res.render('join');
  },
  Join: async(req, res) => {
    const {user_id, password, passwordch, username, email} = req.body;

    try{
      const userid = await user.findOne({where : {user_id}});
      if(userid){
        return res.status(400).send('이미 존재하는 아이디입니다.');
      }

      if(password != passwordch){
        return res.status(400).send('비밀번호가 일치하지 않습니다.');
      }
      
      const hashPassword = await bcrypt.hash(password, 10);

      await user.create({
        user_id,
        password: hashPassword,
        username,
        email
      });
      res.redirect('/login');
    }catch(err){
      console.error('회원 가입 실패', err);
      res.status(500).send('회원 가입 실패');
    }
  }
}

module.exports = loginController;