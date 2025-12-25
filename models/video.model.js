import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    // BASIC INFO
    title: { type: String, required: true },

    description: String,

    // MEDIA
    thumbnailUrl: { type: String, required: true }, // card image
    bannerUrl: { type: String }, // hero background image
    videoUrl: { type: String, required: true }, // Cloudinary URL

    // CLASSIFICATION
    type: {
      type: String,
      enum: ["movie", "series"],
      required: true,
    },

    genres: {
      type: [String],
      default: [],
    },

    language: String,

    ageRestriction: {
      type: String,
      enum: ["U", "UA", "A"],
      default: "UA",
    },

    // VIDEO META
    duration: Number, // minutes
    
    releaseDate: Date,

    quality: {
      type: String,
      enum: ["SD", "HD", "FHD", "4K"],
      default: "HD",
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },
    embedding: { type: [Number], default: [] } 
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);