const {user: userModel, post: postModel, hart:hartModel} = require('../models');

const mypageController = {
  getMypage: async (req, res) => {
    if(!req.session.user){
      return res.send(`
        <script>
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        </script>`);
    }
    try{
      const user_id = req.session.user.user_id;

      const user = await userModel.findOne({
        where: {user_id},
        attributes: ['user_id', 'username', 'email']
      });

      const posts = await postModel.findAll({
        where: {user_id},
        order: [['posted_at', 'DESC']]
      });

      const mypost = await Promise.all(posts.map(async post => {
        const plain = post.toJSON();
        const count = await hartModel.count({where: {post_id: post.post_id}});
        const liked = await hartModel.findOne({
          where: {
            post_id: post.post_id,
            user_id
          }
        });

        return {
          ...plain,
          count,
          liked: !!liked
        };
      }));

      res.render('mypage', {
        user: user.toJSON(),
        posts: mypost
      })
    }catch(err){
      console.error('마이페이지 조회 실패', err);
      res.status(500).send('마이페이지 조회 실패');
    }
  },
  editUsername: async (req, res) => {
    try{
      const user_id = req.session.user.user_id;
      const {username} = req.body;

      if(!username || username.trim() === ''){
        return res.send(
          `<script>
            alert("닉네임을 입력해주세요.");
            window.location.href = "/mypage";
          </script>`
        );
      }

      await userModel.update(
        {username: username.trim()},
        {where: {user_id}}
      );

      req.session.user.username = username.trim();
      res.redirect('/mypage');
    }catch(err){
      console.error('닉네임 수정 실패', err);
      res.status(500).send('닉네임 수정 실패');
    }
  },
};

module.exports = mypageController;