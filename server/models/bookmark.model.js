import mongoose, { Schema, model } from 'mongoose';

const bookmarkSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }
}, { timestamps: true });

const Bookmark = model('Bookmark', bookmarkSchema);
export default Bookmark;
