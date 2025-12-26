import fs from "fs";
import cloudinary from "../ConnectDB/cloudinary.js";
import Video from "../models/video.model.js";
import User from "../models/user.model.js";
import EmbeddingService from "../Utils/aiService.js";
import { updateUserVector } from "../Utils/updateUserPreferences.js";

/* ================= 1. UPLOAD MOVIE (Generates Vector) ================= */
export const uploadMovie = async (req, res) => {
  let videoPath, thumbnailPath, bannerPath;

  try {
    const { title, description, genre, releaseYear, type } = req.body;

    if (!req.files?.video || !req.files?.thumbnail || !req.files?.banner) {
      return res.status(400).json({ message: "All files are required" });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    videoPath = req.files.video[0].path;
    thumbnailPath = req.files.thumbnail[0].path;
    bannerPath = req.files.banner[0].path;

    // Parallel Uploads
    const [videoUpload, thumbnailUpload, bannerUpload] = await Promise.all([
      cloudinary.uploader.upload(videoPath, { resource_type: "video", folder: "netflix/movies", chunk_size: 6000000 }),
      cloudinary.uploader.upload(thumbnailPath, { folder: "netflix/thumbnails" }),
      cloudinary.uploader.upload(bannerPath, { folder: "netflix/banners" }),
    ]);

    // 🧠 AI Step: Generate Vector
    const genreList = genre ? genre.split(",") : [];
    const textContext = `${title} ${genreList.join(" ")} ${description}`;
    const contentVector = await EmbeddingService.generateEmbedding(textContext);

    const movie = await Video.create({
      title,
      description,
      genre: genreList,
      releaseDate: releaseYear ? new Date(releaseYear) : undefined,
      videoUrl: videoUpload.secure_url,
      thumbnailUrl: thumbnailUpload.secure_url,
      bannerUrl: bannerUpload.secure_url,
      duration: Math.round(videoUpload.duration), // stored in seconds
      type: type || "movie",
      embedding: contentVector 
    });

    return res.status(201).json({ message: "Movie uploaded successfully", movie });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  } finally {
    // Cleanup
    if (videoPath && fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (thumbnailPath && fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
    if (bannerPath && fs.existsSync(bannerPath)) fs.unlinkSync(bannerPath);
  }
};

/* ================= 2. LIKE VIDEO (Strong Signal) ================= */
export const likeVideo = async (req, res) => {
  try {
    const { videoId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (user.likedVideos.includes(videoId)) {
      // Unlike
      await User.findByIdAndUpdate(userId, { $pull: { likedVideos: videoId } });
      await Video.findByIdAndUpdate(videoId, { $inc: { likes: -1 } });
      return res.json({ success: true, message: "Unliked", isLiked: false });
    } else {
      // Like
      await User.findByIdAndUpdate(userId, { $addToSet: { likedVideos: videoId } });
      await Video.findByIdAndUpdate(videoId, { $inc: { likes: 1 } });
      
      // 🚀 AI UPDATE: 50% Shift
      updateUserVector(userId, videoId, 0.5);

      return res.json({ success: true, message: "Liked", isLiked: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to like video" });
  }
};

/* ================= 4. GET RECOMMENDATIONS (Vector Search) ================= */
export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        // Cold Start: Return Popular Movies
        if (!user.preferencesVector || user.preferencesVector.length === 0) {
            const popularMovies = await Video.find()
                .sort({ views: -1 })
                .limit(10)
                .select("title thumbnailUrl");
            return res.json(popularMovies);
        }

        // Vector Search
        const recommendations = await Video.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index", 
                    "path": "embedding",
                    "queryVector": user.preferencesVector,
                    "numCandidates": 100, 
                    "limit": 10 
                }
            },
            {
                "$project": {
                    "title": 1,
                    "thumbnailUrl": 1,
                    "score": { "$meta": "vectorSearchScore" } 
                }
            }
        ]);

        res.json(recommendations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching recommendations" });
    }
};

/* ================= 3. GET ALL MOVIES ================= */
export const getAllMovies = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Video.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};