
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const postController = require('../controllers/postController');

// create a new post
router.post('/', auth, postController.createPost);

// update post
router.put('/:id', auth, postController.updatePost);

// delete post
router.delete('/:id', auth, postController.deletePost);

// get all posts by the authenticated user
router.get('/me', auth, postController.getUserPosts);

//  get all posts (publicly accessible)
router.get('/', postController.getAllPosts);

// get a single post by its ID (publicly accessible)
router.get('/:id', postController.getPostById);

// add a like to a specific post (requires authentication)
router.post('/likes/:postId', auth, postController.addLikeToPost);

// delete a like from a specific post (requires authentication)
router.delete('/likes/:postId', auth, postController.removeLikeFromPost); 

// delete all posts by the authenticated user
router.delete('/', auth, postController.deleteAllUserPosts);

module.exports = router;