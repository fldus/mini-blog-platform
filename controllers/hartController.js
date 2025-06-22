const { hart: hartModel } = require("../models");

const hartController = {
  click: async (req, res) => {
    const { post_id } = req.params;
    const user = req.session.user;

    if (!user) {
      return res.send(`
        <script>
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        </script>`);
    }

    try {
      const hart = await hartModel.findOne({
        where: {
          post_id,
          user_id: user.user_id,
        }
      });

      if (hart) {
        // 좋아요 취소
        await hart.destroy();
      } else {
        await hartModel.create({
          post_id,
          user_id: user.user_id,
        });
      }

      const count = await hartModel.count({where: {post_id}});
      res.json({count});
    } catch (err) {
      console.error("좋아요 처리 실패", err);
      res.status(500).send("좋아요 처리 실패");
    }
  },
};

module.exports = hartController;
