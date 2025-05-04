import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import imageKit from "../utils/imagekit.js";

export const getUserSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const { search } = req.query;

    let query = { _id: { $ne: loggedInUserId }}

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const user = await User.find(query).select("-password")

    if (user.length >  0) {
      return res.status(200).json({ data: user })
    } else {
      return res.status(400).json({ error: "No user found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imageUrl = null;
    let imageKitFileId = null;

    if (req.files && req.files["image"]) {
      const imageFile = req.files["image"][0];
      if (!imageFile.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Invalid image file type" });
      }

      const uploadResponse = await imageKit.upload({
        file: imageFile.buffer,
        fileName: imageFile.originalname,
        folder: "/Social-media-app/messages",
      });
      imageUrl = uploadResponse.url;
      imageKitFileId = uploadResponse.fileId;
    }

    if (!text?.trim() && !imageUrl) {
      return res.status(400).json({ error: "Please provide a message or image" });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text?.trim() || "",
      images: imageUrl ? [imageUrl] : [],
      imageKitFileId: imageKitFileId ? [imageKitFileId] : [],
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userChatId },
        { senderId: userChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteMessage = async (req, res) => {
    try {
        const { id:messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId) 

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this message" });
        }

        if (message.imageKitFileId) {
           try {
            await imageKit.deleteFile(message.imageKitFileId);
           } catch (error) {
            return res.status(500).json({ error: "Failed to delete image from ImageKit" });
           }
        }

        if (message.fileKitFileId) {
            try {
                await imageKit.deleteFile(message.fileKitFileId);
            } catch (error) {
                return res.status(500).json({ error: "Failed to delete file from ImageKit" });
            }
        }


        if (message.videosKitFileId) {
            try {
                await imageKit.deleteFile(message.videosKitFileId);
            } catch (error) {
                return res.status(500).json({ error: "Failed to delete video from ImageKit" });
            }
        }

        await Message.findByIdAndDelete(messageId);

        const receiverSocketId = getReceiverSocketId(message.receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", {
                messageId: messageId,
                receiverId: message.receiverId,
            })
        }

        res.status(200).json({ message: "Message deleted successfully", messageId: messageId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
