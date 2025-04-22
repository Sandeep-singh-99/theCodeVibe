import mongoose, { model, Schema } from "mongoose";

const postSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    content: {
        type: String,
        trim: true,
    },

    imagePic: [{
        type: String,
    }],

    imageKitFileId: [{
        type: String,
    }],

    videos: [{
        type: String,
    }],

    videoKitFileId: [{
        type: String,
    }],
},{timestamps: true});

const Post = model("Post", postSchema);

export default Post;