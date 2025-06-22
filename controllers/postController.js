const {user: userModel, post: postModel, file: fileModel, hart:hartModel} = require('../models');
const fs = require('fs');

const postController = {
  // 글 작성 폼
  getPostForm: (req, res) => {
    if(!req.session.user){
      return res.send(`
        <script>
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        </script>`);
    }
    res.render('postForm', {user:req.session.user});
  },
  // 글 추가
  postInput: async (req, res) => {
    if(!req.session.user){
      return res.send(`
        <script>
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        </script>`);
    }
    
    const user_id = req.session.user.user_id;
    const {title, content} = req.body;
    
    try{
      const newPost = await postModel.create({
        user_id,
        title,
        content: content || null
      });

      //  여러 파일 저장
      if(req.files && req.files.length > 0){
        const filePromise = req.files.map(file => 
          fileModel.create({
            post_id : newPost.post_id,
            file_path : file.path,
            file_name : file.originalname
          })
        );
        await Promise.all(filePromise);
      }

      res.redirect('/');
    }catch(err){
      console.error('글 작성 실패', err);
      res.status(500).send('글 작성 실패');
    }
  },
  // 글 목록 조회
  showAll: async (req, res) => {
    try{
      const post = await postModel.findAll({
        include: [{model: userModel, attributes: ['username']}],
        order: [['posted_at', 'DESC']]
      });

      const posts = await Promise.all(post.map(async (post) =>{
        const plain  = post.toJSON();
        const count = await hartModel.count({ where: {post_id: post.post_id}});

        let liked = false;
        if(req.session.user){
          const hart = await hartModel.findOne({
            where: {
              post_id: post.post_id,
              user_id: req.session.user.user_id
            }
          });
          liked = !!hart;
        }

        return {
          ...plain,
          count,
          liked
        };
      }));

      res.render('blog', {
        posts: posts,
        user: req.session.user
      });
    }catch(err){
      console.error('글 목록 조회 실패', err);
      res.status(500).send('글 목록 조회 실패');
    }
  },
  // 글 상세 보기
  showPost: async (req, res) => {
    const post_id = req.params.id;
    try{
      const post = await postModel.findByPk(post_id);
      const files = await fileModel.findAll({where : {post_id}});

      if(!post){
        return res.status(404).send('글을 찾을 수 없습니다.');
      }

      res.render('postDetail', {
        post : post.toJSON(),
        files,
        user : req.session.user,
        path: require('path'),
      });
    }catch(err){
      console.error('글 상세 보기 실패', err);
      res.status(500).send('글 상세 보기 실패');
    }
  },
  // 글 수정 폼
  getEditForm: async (req, res) => {
    if(!req.session.user){
      return res.send(`
        <script>
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        </script>`);
    }

    const post_id = req.params.id;
    const user = req.session.user;

    const post = await postModel.findByPk(post_id);
    const file = await fileModel.findAll({where : {post_id}});

    if(!user || user.user_id !== post.user_id){
      return res.status(403).send('권한이 없습니다.');
    }

    res.render('editForm', {
      post : post.toJSON(),
      file : file,
    });
  },
  // 글 수정
  editPost: async (req, res) => {
    const post_id = req.params.id;
    const {title, content} = req.body;
    const user = req.session.user;

    try{
      const post = await postModel.findByPk(post_id);

      if(!post){
        return res.status(404).send("게시글이 존재하지 않습니다.");
      }else if(!user || user.user_id !== post.user_id){
        return res.status(403).send("권한이 없습니다.");
      }

      await post.update({
        title, 
        content : content || null
      });

      if(req.files && req.files.length > 0){
        const files = req.files.map(file =>
          fileModel.create({
            post_id,
            file_path: file.path,
            file_name: file.originalname
          })
        );
        await Promise.all(files);
      }
      res.redirect(`/post/${post_id}`);
    }catch(err){
      console.error('글 수정 실패', err);
      res.status(500).send('글 수정 실패');
    }
  },
  // 글 삭제
  deletePost: async (req, res) => {
    if(!req.session.user){
      return res.send(`
        <script>
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        </script>`);
    }

    const post_id = req.params.id;
    const user = req.session.user;

    try{
      const post = await postModel.findByPk(post_id);
      
      if(!post){
        return res.status(404).send("게시글이 존재하지 않습니다.");
      }else if(!user || user.user_id !== post.user_id){
        return res.status(403).send("권한이 없습니다.");
      }

      const files = await fileModel.findAll({where : {post_id}});
      for(const file of files){
        fs.unlink(file.file_path, (err) => {
          if(err){
            console.error('파일 삭제 실패', err);
          }
        });
        await file.destroy();
      }

      await post.destroy();
      res.redirect('/');
    }catch(err){
      console.error('글 삭제 실패', err);
      res.status(500).send('글 삭제 실패');
    }
  },
  // 파일 삭제
  deleteFile: async (req, res) => {
    const file_id = req.params.id;
    try{
      const file = await fileModel.findByPk(file_id);
      if(file){
        fs.unlink(file.file_path, (err) => {
          if(err) console.error('파일 삭제 실패', err);
        });
        await file.destroy();
      }
      res.status(204).end();
    }catch(err){
      console.error('파일 삭제 에러', err);
      res.status(500).send('파일 삭제 중 오류 발생');
    }
  },
}

module.exports = postController;