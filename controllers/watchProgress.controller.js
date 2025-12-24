import WatchProgress from "../models/watchProgressSchema.model.js";
export const updateProgress = async (req, res) => {
  try {
    const { videoId, progress, duration } = req.body;
    const userId = req.user.id;

    // Mark as completed if user is at the end (e.g., last 1 minute)
    // Note: If your duration is in minutes, this logic works.
    const completed = progress >= duration - 1; 

    const watch = await WatchProgress.findOneAndUpdate(
      { userId, videoId },
      { progress, completed },
      { upsert: true, new: true }
    );

    res.json({ success: true, watch });
  } catch (err) {
    res.status(500).json({ message: "Failed to update progress" });
  }
};

export const getContinueWatching = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await WatchProgress.find({ userId, completed: false })
      .populate("videoId") // Matches the field name in the schema above
      .sort({ updatedAt: -1 })
      .limit(10);

    // Filter out results where the video might have been deleted
    const validData = data.filter(item => item.videoId !== null);

    res.json(validData);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};
// Get progress for ONE specific video (to resume playback)
export const getVideoProgress = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    const watch = await WatchProgress.findOne({ userId, videoId });
    
    if (!watch) return res.json({ progress: 0 });
    res.json({ progress: watch.progress });
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress" });
  }
};