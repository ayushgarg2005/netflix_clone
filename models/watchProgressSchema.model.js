import mongoose from "mongoose";

const watchProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
    progress: Number, // seconds watched
    completed: { type: Boolean, default: false },
    lastMilestone: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("WatchProgress", watchProgressSchema);
