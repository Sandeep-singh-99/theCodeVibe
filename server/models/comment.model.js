import mongoose, { model, Schema } from 'mongoose';

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Comment = model('Comment', commentSchema);

export default Comment;