import Post from "../models/post.model.js";
import imageKit from "../utils/imagekit.js";

export const createPost = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Please login to create a post" });
    }

    const userId = req.user._id;
    const { content } = req.body;

    const images = [];
    const imageKitFileIds = [];
    const videos = [];
    const videoKitFileIds = [];

    // Handle image uploads if provided
    if (req.files && req.files["images"]) {
      const imageFiles = req.files["images"];

      for (const file of imageFiles) {
        const uploadResponse = await imageKit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/Social-media-app/images",
        });

        images.push(uploadResponse.url);
        imageKitFileIds.push(uploadResponse.fileId);
      }
    }

    // Handle video uploads if provided
    if (req.files && req.files["videos"]) {
      const videoFiles = req.files["videos"];

      for (const file of videoFiles) {
        const uploadResponse = await imageKit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/Social-media-app/videos",
        });

        videos.push(uploadResponse.url);
        videoKitFileIds.push(uploadResponse.fileId);
      }
    }

    const newPost = await Post.create({
      content,
      userId,
      imagePic: images,
      imageKitFileId: imageKitFileIds,
      videos: videos,
      videoKitFileId: videoKitFileIds,
    });

    res.status(201).json({
      data: newPost,
      message: "Post created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "username profilePic email");

    const total = await Post.countDocuments();

    res.status(200).json({
      data: {
        posts,
        page,
        limit,
        total,
      },
      message: "Posts fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTotalPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ error: "Please login to get your posts" });
    }

    const totalPosts = await Post.countDocuments({ userId });

    res.status(200).json({
      data: totalPosts,
      message: "Total posts fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "username profilePic email");

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "No posts found for this user" });
    }

    res.status(200).json({
      data: posts,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    // if (post.imageKitFileId) {
    //   try {
    //     await imageKit.deleteFile(post.imageKitFileId);
    //   } catch (error) {
    //     console.error("ImageKit image delete failed:", error.message);
    //   }
    // }

    // if (post.videoKitFileId) {
    //   try {
    //     await imageKit.deleteFile(post.videoKitFileId);
    //   } catch (error) {
    //     console.error("ImageKit video delete failed:", error.message);
    //   }
    // }

    if (post.imageKitFileId && post.imageKitFileId.length > 0) {
      for (const fileId of post.imageKitFileId) {
        try {
          await imageKit.deleteFile(fileId);
        } catch (error) {
          console.error(
            `ImageKit image delete failed for ID ${fileId}:`,
            error.message
          );
        }
      }
    }

    if (post.videoKitFileId && post.videoKitFileId.length > 0) {
      for (const fileId of post.videoKitFileId) {
        try {
          await imageKit.deleteFile(fileId);
        } catch (error) {
          console.error(
            `ImageKit video delete failed for ID ${fileId}:`,
            error.message
          );
        }
      }
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const post = await Post.findById(id).populate(
      "userId",
      "username profilePic email"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      data: post,
      message: "Post fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Please login to like a post" });
    }

    const postLike = await Post.findById(id);
    if (!postLike) {
      return res.status(404).json({ error: "Post not found" });
    }

    await postLike.updateOne({ $addToSet: { likes: userId } });
    await postLike.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Please login to dislike a post" });
    }

    const postDislike = await Post.findById(id);
    if (!postDislike) {
      return res.status(404).json({ error: "Post not found" });
    }

    await postDislike.updateOne({ $pull: { likes: userId } });
    await postDislike.save();
    res.status(200).json({ message: "Post disliked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const trendingPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Define a time window for trending posts (last 7 days)
    const timeWindow = new Date();
    timeWindow.setDate(timeWindow.getDate() - 7);

    const posts = await Post.aggregate([
      // Filter posts from the last 7 days
      { $match: { createdAt: { $gte: timeWindow } } },
      // Populate likes and comments counts
      {
        $project: {
          content: 1,
          userId: 1,
          imagePic: 1,
          videos: 1,
          createdAt: 1,
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          // Calculate a trending score ( 2 * likes + comments)
          trendingScore: {
            $add: [
              { $multiply: [{ $size: "$likes" }, 2] },
              { $size: "$comments" },
            ],
          },
        },
      },
      { $sort: { trendingScore: -1, createdAt: -1 } },
      // Pagination
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      {
        $project: {
          content: 1,
          imagePic: 1,
          videos: 1,
          createdAt: 1,
          likesCount: 1,
          commentsCount: 1,
          trendingScore: 1,
          userId: {
            username: 1,
            profilePic: 1,
            email: 1,
          },
        },
      },
    ]);

    // Get total count of trending posts
    const total = await Post.countDocuments({
      createdAt: { $gte: timeWindow },
    });

    res.status(200).json({
      data: {
        posts,
        page,
        limit,
        total,
      },
      message: "Trending posts fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
