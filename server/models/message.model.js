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

    imageKitFileId: {
        type: [String],
    },

   
}, {timestamps: true});

const Message = model('Message', messageSchema);

export default Message;