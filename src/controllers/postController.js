
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { successResponse, errorResponse } = require('../helpers/responseHandler');
const mongoose = require('mongoose');

class PostController {

    createPost = async (req, res) => {
        const { title, content } = req.body;
        const authorId = req.user._id; 

        if (!title || !content) {
            return errorResponse(res, 'Title and content are required', {}, 400);
        }
        if (title.length < 3) {
            return errorResponse(res, 'Title must be at least 3 characters long', {}, 400);
        }

        try {
            const newPost = new Post({
                title,
                content,
                authorId
            });

            await newPost.save();
            successResponse(res, 'Post created successfully', { post: newPost });
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500);
        }
    };

    updatePost = async (req, res) => {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user._id; 


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, 'Invalid Post ID', {}, 400);
        }
        if (!title && !content) {
            return errorResponse(res, 'No fields to update provided', {}, 400);
        }
        if (title && title.length < 3) {
            return errorResponse(res, 'Title must be at least 3 characters long', {}, 400);
        }

        try {
            const post = await Post.findById(id);
            if (!post) {
                return errorResponse(res, 'Post not found', {}, 404);
            }

            if (post.authorId.toString() !== userId.toString()) {
                return errorResponse(res, 'Unauthorized: You are not the author of this post', {}, 403);
            }

            if (title) post.title = title;
            if (content) post.content = content;
            post.updatedAt = Date.now(); 
            await post.save();
            successResponse(res, 'Post updated successfully', { post });
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500);
        }
    };

    deletePost = async (req, res) => {
        const { id } = req.params;
        const userId = req.user._id; 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, 'Invalid Post ID', {}, 400);
        }

        try {
            const post = await Post.findById(id);

            if (!post) {
                return errorResponse(res, 'Post not found', {}, 404);
            }

            // Check if user is the author
            if (post.authorId.toString() !== userId.toString()) {
                return errorResponse(res, 'Unauthorized: You are not the author of this post', {}, 403);
            }

            await post.deleteOne();
            successResponse(res, 'Post and associated comments deleted successfully');
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500);
        }
    };

    getUserPosts = async (req, res) => {
        const userId = req.user._id;

        try {
            const posts = await Post.find({ authorId: userId }).sort({ createdAt: -1 });
            successResponse(res, 'User posts fetched successfully', { posts });
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500);
        }
    };

    getAllPosts = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        try {
            const posts = await Post.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('authorId', 'username email id'); 
            const totalPosts = await Post.countDocuments();

            successResponse(res, 'All posts fetched successfully', {
                posts,
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts
            });
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500);
        }
    };


    getPostById = async (req, res) => {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, 'Invalid Post ID', {}, 400);
        }

        try {
            const post = await Post.findById(id).populate('authorId', 'username email id'); 
            if (!post) {
                return errorResponse(res, 'Post not found', {}, 404);
            }
            successResponse(res, 'Post fetched successfully', { post });
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500);
        }
    };

    addLikeToPost = async (req, res) => {
        const { postId } = req.params;
        const userId = req.user._id; 

        // validation 
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return errorResponse(res, 'Invalid Post ID', {}, 400);
        }

        try {
            const post = await Post.findById(postId);

            if (!post) {
                return errorResponse(res, 'Post not found', {}, 404);
            }

            // Check if the user has already liked the post
            if (post.likes.includes(userId)) {
                return errorResponse(res, 'You have already liked this post', {}, 400);
            }

            post.likes.push(userId);
            await post.save();

            successResponse(res, 'Post liked successfully', { post });
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500); 
        }
    };


    removeLikeFromPost = async (req, res) => {
        const { postId } = req.params;
        const userId = req.user._id; 

        // validation
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return errorResponse(res, 'Invalid Post ID', {}, 400); 
        }

        try {
            const post = await Post.findById(postId);

            if (!post) {
                return errorResponse(res, 'Post not found', {}, 404); 
            }

            if (!post.likes.includes(userId)) {
                return errorResponse(res, 'You have not liked this post', {}, 400); 
            }

            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
            await post.save();

            successResponse(res, 'Like removed successfully', { post }); 
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500); 
        }
    };

    deleteAllUserPosts = async (req, res) => {
        const userId = req.user._id;

        try {
            const userPosts = await Post.find({ authorId: userId }); 

            for (const post of userPosts) {
                await post.deleteOne(); 
            }

            successResponse(res, 'All your posts and their associated comments deleted successfully'); 
        } catch (err) {
            console.error(err.message);
            errorResponse(res, 'Server Error', {}, 500); 
        }
    };
}
module.exports = new PostController();
