
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const commentController = require('../controllers/commentController');


router.post('/', auth, commentController.createComment);

router.get('/:postId', commentController.getCommentsByPostId);

router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;