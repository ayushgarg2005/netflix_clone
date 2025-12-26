import express from "express";
import upload from "../middleware/multer.middleware.js";
import userAuth from "../middleware/auth.middleware.js"; // ✅ Import Auth Middleware
import { 
  uploadMovie, 
  getAllMovies, 
  getMovieById,
  getRecommendations, // ✅ New
  likeVideo           // ✅ New
} from "../controllers/uploadMovie.controller.js"; // ⚠️ Rename your file to video.controller.js

const router = express.Router();

// 1. Upload (Admin only usually, but open for now)
router.post(
  "/upload",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "banner", maxCount: 1 }
  ]),
  uploadMovie
);

// 2. Public Routes (Anyone can see list)
router.get("/all", getAllMovies);

// 3. AI & Personalization (Needs Login)
router.get("/recommendations", userAuth, getRecommendations); // ✅ AI Route
router.post("/like", userAuth, likeVideo);                    // ✅ Like Route

// 4. Specific Movie (Put this last so it doesn't catch "recommendations" as an ID)
router.get("/:id", getMovieById);

export default router;