import cron from 'node-cron'
import Stories from '../models/stories.model.js';
import imageKit from '../utils/imagekit.js';

export const deleteExpiredStories = cron.schedule('*/5 * * * *', async () => {
    try {
        const now = new Date()
        const expiredStories = await Stories.find({ expiresAt: { $lte: now }})

        for (const story of expiredStories) {
            const allFileId = [...story.imageKitFileId, ...story.videoKitFileId]

            for (const fileId of allFileId) {
                try {
                    await imageKit.deleteFile(fileId)
                } catch (error) {
                    console.error('Error deleting file from ImageKit:', error);
                }
            }
            await story.findByIdAndDelete(story._id)
        }

        console.log('Expired stories deleted successfully');
    } catch (error) {
        console.error('Error deleting expired stories:', error);
    }
})