import fs from "fs";
import cloudinary from "../ConnectDB/cloudinary.js";

export const uploadMovie = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);
    const { title, description, genre, releaseYear } = req.body;

    if (!req.files?.video || !req.files?.thumbnail) {

    // Delete local files
        fs.unlinkSync(videoPath);
        fs.unlinkSync(thumbnailPath);

        return res.status(400).json({
            message: "Video and thumbnail both are required",
        });
    }
    if (!title?.trim()) {
      // Remove temp files from multer
        fs.unlinkSync(videoPath);
        fs.unlinkSync(thumbnailPath);

        return res.status(400).json({ message: "Title is required" })
    };

    const videoPath = req.files.video[0].path;
    const thumbnailPath = req.files.thumbnail[0].path;

    // Upload video
    const videoUpload = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video",
      folder: "netflix/movies",
    });

    // Upload thumbnail
    const thumbnailUpload = await cloudinary.uploader.upload(thumbnailPath, {
      folder: "netflix/thumbnails",
    });

    // Delete local files
    fs.unlinkSync(videoPath);
    fs.unlinkSync(thumbnailPath);

    // 👉 Save these URLs in Prisma DB (example response for now)
    res.status(201).json({
      message: "Movie uploaded successfully",
      movie: {
        title,
        description,
        genre,
        releaseYear,
        videoUrl: videoUpload.secure_url,
        videoPublicId: videoUpload.public_id,
        thumbnailUrl: thumbnailUpload.secure_url,
        thumbnailPublicId: thumbnailUpload.public_id,
        duration: videoUpload.duration,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Movie upload failed",
      error: error.message,
    });
  }
};