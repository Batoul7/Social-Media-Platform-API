
const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/logout',auth, authController.logout);

module.exports = router;