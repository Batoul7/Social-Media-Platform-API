// functions to generate and verify JSON Web Tokens (JWTs) using a secret key from environment variables.
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is missing in environment variables!");
    }
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};


const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };