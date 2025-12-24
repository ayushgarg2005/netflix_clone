import express from "express";
import userAuth from "../middleware/auth.middleware.js";
import {
  updateProgress,
  getContinueWatching,
    getVideoProgress,
} from "../controllers/watchProgress.controller.js";

const router = express.Router();

// save / update progress
router.post("/update", userAuth, updateProgress);

// get continue watching list
router.get("/continue-watching", userAuth, getContinueWatching);

router.get("/:videoId", userAuth, getVideoProgress);

export default router;
