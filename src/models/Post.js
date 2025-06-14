
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    likes: {
        type: [Schema.Types.ObjectId], 
        ref: 'User',
        default: []
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    }, {
        timestamps: true 
    }
);


module.exports = mongoose.model('Post', PostSchema);