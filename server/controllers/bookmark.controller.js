import Bookmark from "../models/bookmark.model.js";

export const createBookMark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const bookmarkExist = await Bookmark.findOne({ userId, postId: id });

    if (bookmarkExist) {
      return res.status(400).json({ error: "Bookmark already exists" });
    }

    const bookmarks = await Bookmark.create({
      userId,
      postId: id,
    });

    res
      .status(200)
      .json({ data: bookmarks, message: "Bookmark created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookmarks = await Bookmark.find({ userId }).populate({
      path: "postId",
      model: "Post",
      populate: {
        path: "userId",
        model: "User",
        select: "username email profilePic bio",
      },
    });

    res.status(200).json({ data: bookmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
