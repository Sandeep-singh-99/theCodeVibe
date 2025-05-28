import mongoose, { model, Schema } from "mongoose";

const storiesSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
    
}, { timestamps: true });

storiesSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Stories = model("Stories", storiesSchema);

export default Stories;
