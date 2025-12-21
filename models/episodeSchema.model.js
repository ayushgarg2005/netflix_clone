const episodeSchema = new mongoose.Schema({
  seasonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Season",
    required: true
  },
  title: String,
  description: String,
  duration: Number,
  videoUrl: String,
  episodeNumber: Number
});

export default mongoose.model("Episode", episodeSchema);
