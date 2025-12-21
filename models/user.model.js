import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      isEmailVerified: true
    },

    password: { type: String, required: true },

    avatar: { type: String }, // profile image

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "standard", "premium"],
        default: "free"
      },
      status: {
        type: String,
        enum: ["active", "inactive", "cancelled"],
        default: "inactive"
      },
      expiryDate: Date
    },

    watchHistory: [
      {
        videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
        watchedAt: Date,
        progress: Number // in seconds
      }
    ],

    likedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],

    isEmailVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
