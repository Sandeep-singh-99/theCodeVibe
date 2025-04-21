import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import imageKit from "../utils/imagekit.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const UserExists = await User.findOne({ email })

        if (UserExists) {
            return res.status(400).json({ error: "User already exists" })
        }

        if (!req.file) {
            return res.status(400).json({ error: "Please upload a profile picture" })
        }

        const uploadResponse = await imageKit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/Social-media-app/auth-profile",
        })

        const newUser = await User.create({
            username,
            email,
            password,
            profilePic: uploadResponse.url,
            imageKItFileId: uploadResponse.fileId,
        })

        if (newUser) {
            generateToken(newUser._id, res)
            res.status(201).json({ data: newUser, message: "User created successfully" })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" })
        }

        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" })
        }

        generateToken(user._id, res)
        res.status(200).json({ data: user, message: "Login successful" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('insta')
        res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({ data: req.user })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { username, bio } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ error: "Please login" });
        }

        // Initialize update object
        const updateData = {};

        // Handle image upload if a file is provided
        if (req.file) {
            const uploadResponse = await imageKit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "/Social-media-app/auth-profile",
            });

           
            updateData.profilePic = uploadResponse.url;
            updateData.imageKItFileId = uploadResponse.fileId;

           
            const user = await User.findById(userId);
            if (user.imageKItFileId) {
                try {
                    await imageKit.deleteFile(user.imageKItFileId);
                } catch (deleteError) {
                    res.status(500).json({ error: "Error deleting old profile picture" });
                }
            }
        }

        if (username) {
            updateData.username = username;
        }

        if (bio !== undefined) {
            updateData.bio = bio;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update" });
        }

        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ data: updatedProfile, message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};