
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { successResponse, errorResponse } = require('../helpers/responseHandler');
const mongoose = require('mongoose');

class CommentController {
    createComment = async (req, res) => {
        const { content, postId } = req.body;
        const authorId = req.user._id; 

        if (!content || !postId) {
            return errorResponse(res, 'Content and postId are required', {}, 400);
        }
        if (content.length < 1) { 
            return errorResponse(res, 'Comment cannot be empty', {}, 400);
        }
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return errorResponse(res, 'Invalid Post ID', {}, 400);
        }

        try {
            const post = await Post.findById(postId);
            if (!post) {
                return errorResponse(res, 'Post not found', {}, 404);
            }

            const newComment = new Comment({
                content,
                authorId,
                postId
            });

            await newComment.save();

            post.comments.push(newComment._id);
            await post.save();

            successResponse(res, 'Comment created successfully', { comment: newComment });
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500);
        }
    };

    getCommentsByPostId = async (req, res) => {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return errorResponse(res, 'Invalid Post ID', {}, 400);
        }

        try {
            const comments = await Comment.find({ postId })
                .populate('authorId', 'username email id') 
                .sort({ createdAt: 1 });

            successResponse(res, 'Comments fetched successfully', { comments });
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500);
        }
    };

    deleteComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, 'Invalid Comment ID', {}, 400);
    }

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return errorResponse(res, 'Comment not found', {}, 404);
        }

        if (comment.authorId.toString() !== userId.toString()) {
            return errorResponse(res, 'Unauthorized: You are not the author of this comment', {}, 403);
        }

        await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: comment._id } });

        await comment.deleteOne();

        successResponse(res, 'Comment deleted successfully');
    } catch (err) {
        console.error(err.message);
        errorResponse(res, 'Server Error', {}, 500);
    }
};
}
module.exports = new CommentController();