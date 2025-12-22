import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true
    },

    recommendedVideos: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Video" }
    ],

    reason: String // "based on watch history", "genre preference"
  },
  { timestamps: true }
);

export default mongoose.model("Recommendation", recommendationSchema);
