// services/recommendation.service.js
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import embeddingService from "./embedding.service.js";

export const updateVideoEmbedding = async (videoId) => {
  const video = await Video.findById(videoId);
  const text = `${video.title} ${video.description} ${video.genres.join(" ")}`;
  video.embedding = await embeddingService.generate(text);
  await video.save();
};

export const updateUserTaste = async (userId, videoId) => {
  const user = await User.findById(userId);
  const video = await Video.findById(videoId);

  if (!video.embedding.length) return;

  if (!user.tasteProfile || user.tasteProfile.length === 0) {
    user.tasteProfile = video.embedding;
  } else {
    // Hybrid approach: 90% current taste, 10% new interaction
    // This allows the profile to evolve over time
    user.tasteProfile = user.tasteProfile.map((val, i) => 
      (val * 0.9) + (video.embedding[i] * 0.1)
    );
  }
  await user.save();
};

export const getHybridRecommendations = async (userId) => {
  const user = await User.findById(userId);

  // COLD START: If new user, return top-rated/trending
  if (!user || !user.tasteProfile || user.tasteProfile.length === 0) {
    return await Video.find().sort({ views: -1, rating: -1 }).limit(10);
  }

  // SEMANTIC SEARCH: Find videos matching user taste vector
  return await Video.aggregate([
    {
      "$vectorSearch": {
        "index": "vector_index", // Created in MongoDB Atlas UI
        "path": "embedding",
        "queryVector": user.tasteProfile,
        "numCandidates": 100,
        "limit": 12
      }
    },
    {
      "$match": {
        "_id": { "$nin": user.likedVideos } // Don't show already liked
      }
    },
    {
      "$project": {
        "embedding": 0, // Don't send vectors to frontend
        "score": { "$meta": "vectorSearchScore" }
      }
    }
  ]);
};