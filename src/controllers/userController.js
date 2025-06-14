
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { successResponse, errorResponse } = require('../helpers/responseHandler');
const argon2 = require('argon2');


exports.getUserProfile = async (req, res) => {
    try {
        const user = req.user; 
        successResponse(res, 'User profile fetched successfully', { user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err.message);
        errorResponse(res, 'Server Error', {}, 500);
    }
};


exports.updateUserProfile = async (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.user._id;

    // validation
    if (!username && !email && !password) {
        return errorResponse(res, 'No fields to update provided', {}, 400);
    }
    if (username && username.length < 3) {
        return errorResponse(res, 'Username must be at least 3 characters long', {}, 400);
    }
    if (email && !/^.+@.+\..+$/.test(email)) {
        return errorResponse(res, 'Please enter a valid email address', {}, 400);
    }
    if (password && password.length < 6) {
        return errorResponse(res, 'Password must be at least 6 characters long', {}, 400);
    }

    try {
        const updateFields = {};
        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return errorResponse(res, 'Username is already taken', {}, 400);
            }
            updateFields.username = username;
        }
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return errorResponse(res, 'Email is already taken', {}, 400);
            }
            updateFields.email = email;
        }
        if (password) {
            updateFields.password = await argon2.hash(password);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields, updatedAt: Date.now() }, { new: true }).select('-password');

        if (!updatedUser) {
            return errorResponse(res, 'User not found', {}, 404);
        }

        successResponse(res, 'User profile updated successfully', { user: { id: updatedUser.id, username: updatedUser.username, email: updatedUser.email } });
    } catch (err) {
        console.error(err.message);
        errorResponse(res, 'Server Error', {}, 500);
    }
};


exports.deleteUserAccount = async (req, res) => {
    const userId = req.user._id; 

    try {
        const userPosts = await Post.find({ authorId: userId });
        for (const post of userPosts) {
            await post.remove();
        }

        await Comment.deleteMany({ authorId: userId });

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return errorResponse(res, 'User not found', {}, 404);
        }

        successResponse(res, 'User account and all associated posts and comments deleted successfully');
    } catch (err) {
        console.error(err.message);
        errorResponse(res, 'Server Error', {}, 500);
    }
};

exports.resetUserData = async (req, res) => {
    const userId = req.user._id;

    try {
        // Delete all posts by the user
        const userPosts = await Post.find({ authorId: userId }); 
        for (const post of userPosts) {
            await post.deleteOne();
        }

        // Delete all comments by the user
        await Comment.deleteMany({ authorId: userId }); 

        successResponse(res, 'All your posts and comments have been deleted. Your account information remains.'); 
    } catch (err) {
        console.error(err.message);
        errorResponse(res, 'Server Error', {}, 500); 
    }
};