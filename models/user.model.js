import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    avatar: { type: String }, // profile image

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    watchHistory: [
      {
        videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
        watchedAt: Date,
        progress: Number // in seconds
      }
    ],

    likedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    tasteProfile: { type: [Number], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
