import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  videoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Video", 
    required: true 
  },
  viewedAt: { 
    type: Date, 
    default: Date.now, 
    index: { expires: '24h' } // Automatically removes record after 24 hours
  }
});

// Ensure a user can only have one "active" view record per video to prevent spam
viewSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export default mongoose.model("View", viewSchema);