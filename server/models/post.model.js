import mongoose, { model, Schema } from "mongoose";

const postSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    contentText: {
        type: String,
        required: true,
        trim: true,
    },

    imagePic: {
        type: String,
    },

    imageKItFileId: {
        type: String,
    },

    videos: {
        type: String,
    },

    videoKItFileId: {
        type: String,
    },
},{timestamps: true});

const Post = model("Post", postSchema);

export default Post;