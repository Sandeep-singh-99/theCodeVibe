import Post from "../models/post.model.js";
import imageKit from "../utils/imagekit.js";

export const createPost = async (req, res) => {
    try {
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "Please login to create a post" });
        }
        
        const userId = req.user._id;
        const { content } = req.body;

        console.log("req.body:", req.body);
        console.log("req.files:", req.files);

       
        const images = [];
        const imageKitFileIds = [];
        const videos = [];
        const videoKitFileIds = [];

        // Handle image uploads if provided
        if (req.files && req.files['images']) {
            const imageFiles = req.files['images'];
            
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
        if (req.files && req.files['videos']) {
            const videoFiles = req.files['videos'];
            
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
            videoKitFileId: videoKitFileIds  
        });

        res.status(201).json({ 
            data: newPost, 
            message: "Post created successfully" 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate("userId", "fullName profileImage email").exec();

        res.status(200).json({ data: posts, message: "Posts fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}