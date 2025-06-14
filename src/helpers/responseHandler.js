// // Handles sending a successful API response
const successResponse = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        state: 'success',
        message,          
        data              
    });
};
// Handles sending an error API response
const errorResponse = (res, message, data = {}, statusCode = 500) => {
    return res.status(statusCode).json({
        state: 'error',   
        message,          
        data              
    });
};

module.exports = { successResponse, errorResponse };