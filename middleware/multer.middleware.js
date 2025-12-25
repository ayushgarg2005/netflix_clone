import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(
      "C:/Users/ASUS/OneDrive/Desktop/Netflix_Project/netflix_backend/TempVideoFiles"
    ))
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
    );
  },
});

// ✅ FILE FILTER
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    const allowedVideos = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
    if (allowedVideos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid video format"), false);
    }
  }

  if (file.fieldname === "thumbnail" || file.fieldname === "banner") {
    const allowedImages = ["image/jpeg", "image/png", "image/webp"];
    if (allowedImages.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid thumbnail or banner format"), false);
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB (video)
  },
});

export default upload;