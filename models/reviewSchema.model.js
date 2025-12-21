const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },

    rating: {
      type: Number,
      min: 1,
      max: 5
    },

    comment: String
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
