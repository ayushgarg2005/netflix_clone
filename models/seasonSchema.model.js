import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema({
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true
  },
  seasonNumber: Number,
  releaseDate: Date
});

export default mongoose.model("Season", seasonSchema);
