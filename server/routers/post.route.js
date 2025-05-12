import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createPost, deletePost, getAllPost, getPostById, getPostByUserId, getTotalPosts } from '../controllers/post.controller.js';

const router = express.Router();

const uplodFields = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 },
])


router.route("/create-post").post(authMiddleware, uplodFields, createPost)

router.route("/get-all-post").get(getAllPost)

router.route("/get-total-post").get(authMiddleware, getTotalPosts)

router.route("/get-user-post").get(authMiddleware, getPostByUserId)

router.route("/get-user-post-delete/:id").delete(authMiddleware, deletePost)

router.route("/get-post/:id").get(authMiddleware, getPostById)

export default router;