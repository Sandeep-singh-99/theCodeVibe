import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createPost, getAllPost, getTotalPosts } from '../controllers/post.controller.js';

const router = express.Router();

const uplodFields = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 },
])


router.route("/create-post").post(authMiddleware, uplodFields, createPost)

router.route("/get-all-post").get(getAllPost)

router.route("/get-total-post").get(authMiddleware, getTotalPosts)

export default router;