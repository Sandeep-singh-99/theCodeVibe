import express from 'express';
import { checkAuth, login, logout, register } from '../controllers/user.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/signup").post(upload.single('image'), register)

router.route("/login").post(login)

router.route("/logout").post(logout)

router.route("/check-auth").get(authMiddleware, checkAuth)

export default router;

