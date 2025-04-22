import Post from "../models/post.model.js";
import imageKit from "../utils/imagekit.js";

export const createPost = async (req, res) => {
    try {
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "Please login to create a post" });
        }
        
        const userId = req.user._id;
        const { content } = req.body;

       
        if (!content) {
            return res.status(400).json({ error: "Post content is required" });
        }

       
        const images = [];
        const imageKitFileIds = [];
        const videos = [];
        const videoKitFileIds = [];

        // Handle image uploads if provided
        if (req.files && req.files['images']) {
            const imageFiles = req.files['images'];
            
            for (const file of imageFiles) {
                if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
                    return res.status(400).json({ error: "Only JPEG and PNG allowed for images" });
                }
                
                const uploadResponse = await imageKit.upload({
                    file: file.buffer,
                    fileName: file.originalname,
                    folder: '/social-media-app/images'
                });
                
                images.push(uploadResponse.url);
                imageKitFileIds.push(uploadResponse.fileId);
            }
        }

        // Handle video uploads if provided
        if (req.files && req.files['videos']) {
            const videoFiles = req.files['videos'];
            
            for (const file of videoFiles) {
                if (!['video/mp4'].includes(file.mimetype)) {
                    return res.status(400).json({ error: "Only MP4 allowed for videos" });
                }
                
                const uploadResponse = await imageKit.upload({
                    file: file.buffer,
                    fileName: file.originalname,
                    folder: '/social-media-app/videos'
                });
                
                videos.push(uploadResponse.url);
                videoKitFileIds.push(uploadResponse.fileId);
            }
        }

        const newPost = await Post.create({
            content,
            userId,
            image: images,          
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