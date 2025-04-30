import mongoose, { model, Schema } from 'mongoose';

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    text: {
        type: String
    },

    images: {
        type: [String],
        default: [],
    },

    videos: {
        type: [String],
        default: [],
    },

    file: {
        type: String,
    },

    fileKitFileId: {
        type: String,
    },

    imageKitFileId: {
        type: [String],
    },

    videosKitFileId: {
        type: [String],
    }
}, {timestamps: true});

const Message = model('Message', messageSchema);

export default Message;