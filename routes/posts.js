const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({storage});

router.post('/', upload.array('file', 10), postController.postInput);
router.get('/postForm', postController.getPostForm);
router.get('/:id', postController.showPost);
router.get('/edit/:id', postController.getEditForm);
router.post('/edit/:id', upload.array('file'), postController.editPost);
router.delete('/file/:id', postController.deleteFile);
router.get('/delete/:id', postController.deletePost);

module.exports = router;