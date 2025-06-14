
const User = require('../models/User');
const argon2 = require('argon2');
const { generateToken } = require('../helpers/jwtHelper');
const { successResponse, errorResponse } = require('../helpers/responseHandler');
const { addToBlacklist } = require('../helpers/tokenBlacklist');

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;


    if (!username || !email || !password) {
        return errorResponse(res, 'Please enter all fields', {}, 400);
    }

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return errorResponse(res, 'User already exists', {}, 400);
        }

        const hashedPassword = await argon2.hash(password);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        let token;
        try {
            token = generateToken({ userId: user._id });
        } catch (tokenError) {
            console.error("Token Error:", tokenError);
            return successResponse(res, 'User registered but token generation failed', { userId: user._id }, 201);
        }

        successResponse(res, 'User registered successfully', { 
            token, 
            user: { id: user._id, username, email } 
        }, 201);

    } catch (err) {
        console.error("Signup Error:", err);
        errorResponse(res, 'Server Error', {}, 500);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        return errorResponse(res, 'Please enter all fields', {}, 400);
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 'Invalid Credentials', {}, 400);
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid Credentials', {}, 400);
        }

        const token = generateToken({ userId: user._id });

        successResponse(res, 'Logged in successfully', { token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err.message);
        errorResponse(res, 'Server Error', {}, 500);
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return errorResponse(res, 'No token provided', {}, 401);
        }

        addToBlacklist(token);

        successResponse(res, 'Logged out successfully');
    } catch (err) {
        console.error('Logout Error:', err);
        errorResponse(res, 'Server Error during logout', {}, 500);
    }
};