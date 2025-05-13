import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { addComment, getComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.route("/add-comment/:id").post(authMiddleware, addComment)

router.route("/get-comment/:id").get(getComment)

export default router;