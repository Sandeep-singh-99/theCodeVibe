import express from 'express';
import { checkAuth, followOrUnfollow, getFollowerOrFollowing, getSuggestedUsers, getUserById, login, logout, register, updateProfile } from '../controllers/user.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/signup").post(upload.single('image'), register)

router.route("/login").post(login)

router.route("/logout").post(logout)

router.route("/check-auth").get(authMiddleware, checkAuth)

router.route("/update-profile").put(authMiddleware, upload.single('image'), updateProfile)

router.route("/follow/:id").put(authMiddleware, followOrUnfollow)

router.route("/follow-or-following").get(authMiddleware, getFollowerOrFollowing)

router.route("/suggested").get(authMiddleware, getSuggestedUsers)

router.route("/getUser/:id").get(authMiddleware, getUserById)

export default router;

