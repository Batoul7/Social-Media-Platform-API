
const express = require('express');
const { errorResponse } = require('./helpers/responseHandler'); 


const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Handling Unknown Paths (404 Not Found)
app.use((req, res) => {
    errorResponse(res, 'Not Found', {}, 404);
});

module.exports = app;