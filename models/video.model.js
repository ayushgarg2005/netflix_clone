import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: String,

    genre: [String],

    language: String,

    duration: Number, // in minutes

    releaseDate: Date,

    thumbnailUrl: String,

    videoUrl: String, // Cloudinary URL

    type: {
      type: String,
      enum: ["movie", "series"],
      required: true
    },

    rating: {
      type: Number,
      default: 0
    },

    views: {
      type: Number,
      default: 0
    },

    ageRestriction: {
      type: String,
      enum: ["U", "UA", "A"],
      default: "UA"
    },

    isPremium: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
