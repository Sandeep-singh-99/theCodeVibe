import Stories from "../models/stories.model.js";
import User from "../models/user.model.js";
import imageKit from "../utils/imagekit.js";

export const addStories = async (req, res) => {
  try {
    const userId = req.user._id;

    const images = [];
    const imageKitFileIds = [];
    const videos = [];
    const videoKitFileIds = [];

    if (req.files && req.files["images"]) {
      const imageFiles = req.files["images"];

      for (const file of imageFiles) {
        const uploadResponse = await imageKit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/Social-media-app/stories",
        });

        images.push(uploadResponse.url)
        imageKitFileIds.push(uploadResponse.fileId);
      }
    }

    if (req.files && req.files["videos"]) {
        const videoFiles = req.files["videos"]

        for (const files of videoFiles) {
            const uploadResponse = await imageKit.upload({
                file: files.buffer,
                fileName: files.originalname,
                folder: "/Social-media-app/stories",
            });
            videos.push(uploadResponse.url);
            videoKitFileIds.push(uploadResponse.fileId);
        }
    }

    const newStories = await Stories.create({
        userId,
        imagePic: images,
        imageKitFileId: imageKitFileIds,
        videos: videos,
        videoKitFileId: videoKitFileIds,
    })

    res.status(201).json({ data: newStories, message: "Stories added successfully" });
  } catch (error) {
    res.status(500).json({ errorr: error.message });
  }
};


export const getStories = async (req, res) => {
  try {
    const { userId } = req.params

    const requestingUserId = req.user._id

    const storyOwner = await User.findById(userId).select("followers")

    if (!storyOwner) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollower = storyOwner.followers.includes(requestingUserId)
    if (!isFollower && !requestingUserId.equals(userId)) {
      return res.status(403).json({ message: "You are not authorized to view this user's stories" });
    }

    const stories = await Stories.find({ userId }).populate("userId", "username profilePic").sort({ createdAt: -1 });

    if (!stories || stories.length === 0) {
      return res.status(404).json({ message: "No stories found" });
    }

    res.status(200).json({ data: stories, message: "Stories fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

