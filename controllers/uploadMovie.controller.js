import fs from "fs";
import cloudinary from "../ConnectDB/cloudinary.js";
import Video from "../models/video.model.js";

export const uploadMovie = async (req, res) => {
  let videoPath;
  let thumbnailPath;
  let bannerPath;

  try {
    const { title, description, genre, releaseYear, type } = req.body;

    // ✅ Validate files
    if (!req.files?.video || !req.files?.thumbnail || !req.files?.banner) {
      return res.status(400).json({
        message: "Video, thumbnail, and banner are all required",
      });
    }

    // ✅ Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    videoPath = req.files.video[0].path;
    thumbnailPath = req.files.thumbnail[0].path;
    bannerPath = req.files.banner[0].path;

    // ✅ Upload video to Cloudinary
    const videoUpload = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video",
      folder: "netflix/movies",
      chunk_size: 6000000, // prevents 413 error
    });

    // ✅ Upload thumbnail
    const thumbnailUpload = await cloudinary.uploader.upload(thumbnailPath, {
      folder: "netflix/thumbnails",
    });

    // ✅ Upload banner
    const bannerUpload = await cloudinary.uploader.upload(bannerPath, {
      folder: "netflix/banners",
    });

    // ✅ Save to MongoDB
    const movie = await Video.create({
      title,
      description,
      genre: genre ? genre.split(",") : [],
      releaseDate: releaseYear ? new Date(releaseYear) : undefined,
      videoUrl: videoUpload.secure_url,
      thumbnailUrl: thumbnailUpload.secure_url,
      bannerUrl: bannerUpload.secure_url,
      duration: Math.round(videoUpload.duration / 60), // minutes
      type: type || "movie",
    });

    return res.status(201).json({
      message: "Movie uploaded successfully",
      movie,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Movie upload failed",
      error: error.message,
    });
  } finally {
    // ✅ Always cleanup local files
    if (videoPath && fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
    if (thumbnailPath && fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }
    if (bannerPath && fs.existsSync(bannerPath)) {
      fs.unlinkSync(bannerPath);
    }
  }
};

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