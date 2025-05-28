import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { addStories, getStories } from '../controllers/stories.controller.js';

const router = express.Router();

const uplodFields = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 },
])

router.route("/add-stories").post(authMiddleware, uplodFields, addStories)

router.route("/stories/:userId").get(authMiddleware, getStories)

export default router;