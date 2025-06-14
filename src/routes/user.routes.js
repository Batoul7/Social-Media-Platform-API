
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// get the authenticated user's profile information
router.get('/me', auth, userController.getUserProfile);

// update the authenticated user's profile data
router.put('/me', auth, userController.updateUserProfile);

// elete the authenticated user's account, including associated posts and comments
router.delete('/me', auth, userController.deleteUserAccount);

// delete all posts and comments by the user, while keeping the user's account information
router.put('/reset', auth, userController.resetUserData);

module.exports = router;