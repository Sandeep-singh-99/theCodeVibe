import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createBookMark, deleteBookmark, getBookmarks } from '../controllers/bookmark.controller.js';

const router = express.Router();

router.route("/add-bookmark/:id").post(authMiddleware, createBookMark)

router.route("/get-bookmark").get(authMiddleware, getBookmarks)

router.route("/delete-bookmark/:id").delete(authMiddleware, deleteBookmark)

export default router;