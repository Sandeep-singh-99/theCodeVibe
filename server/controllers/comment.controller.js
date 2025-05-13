import Comment from "../models/comment.model.js";

export const addComment = async (req, res) => {
    try {
        const { content } = req.body;

        const { id } = req.params;

        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (!content) {
            return res.status(400).json({ error: "Comment text is required" });
        }

        const newComment = await Comment.create({ content, postId: id, userId })

        res.status(201).json({ data: newComment, message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comments = await Comment.find({ postId: id }).populate("userId", "username profilePic email").sort({ createdAt: -1 });
        if (!comments || comments.length === 0) {
            return res.status(404).json({ error: "No comments found for this post" });
        }
        
        res.status(200).json({ data: comments, message: "Comments fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}