import express from "express";
import upload from "../middleware/multer.middleware.js";
import { uploadMovie, getAllMovies } from "../controllers/uploadMovie.controller.js";

const router = express.Router();

router.post(
  "/upload",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadMovie
);

router.get("/all", getAllMovies);
export default router;