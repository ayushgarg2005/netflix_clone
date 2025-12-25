// controllers/video.controller.js
import { RecommendationService } from "../services/recommender.service.js";

// When user likes a video
export const likeVideo = async (req, res) => {
  const { userId, videoId } = req.body;
  
  await User.findByIdAndUpdate(userId, { $addToSet: { likedVideos: videoId } });
  
  // Update the user's taste profile in the background
  RecommendationService.updateTasteProfile(userId, videoId);
  
  res.status(200).json({ message: "Liked successfully" });
};

// Feed Endpoint
export const getHomeFeed = async (req, res) => {
  try {
    const recommendations = await RecommendationService.getRecommended(req.user.id);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};