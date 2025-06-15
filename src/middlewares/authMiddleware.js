// function authenticates user requests by verifying a JWT, checking if it's blacklisted
const { verifyToken } = require('../helpers/jwtHelper');
const { errorResponse } = require('../helpers/responseHandler');
const User = require('../models/User');
const { isBlacklisted } = require('../helpers/tokenBlacklist'); 

const auth = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
        return errorResponse(res, 'No token, authorization denied', {}, 401);
        }

        const tokenIsBlacklisted = await isBlacklisted(token);
        if (tokenIsBlacklisted) {
            return errorResponse(res, 'Token revoked. Please login again.', {}, 401);
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
            return errorResponse(res, 'Token is not valid', {}, 401);
        }

        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            return errorResponse(res, 'User not found', {}, 404);
        }

        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        errorResponse(res, 'Server Error: Invalid token', {}, 500);
    }
};

module.exports = auth;