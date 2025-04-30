import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { deleteMessage, getMessage, getUserSideBar, sendMessage } from '../controllers/message.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.route("/chat-message/:id").get(authMiddleware, getMessage)

router.route("/users").get(authMiddleware, getUserSideBar)

router.route("/send/:id").post(authMiddleware, upload.fields([ { name: 'image' }, { name: 'file' }, { name: 'video '} ]), sendMessage)

router.route("/delete-message/:id").delete(authMiddleware, deleteMessage)

export default router;
