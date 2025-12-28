import WatchProgress from "../models/watchProgressSchema.model.js";
// ✅ Import the AI Helper
import { updateUserVector } from "../Utils/updateUserPreferences.js"; 

export const updateProgress = async (req, res) => {
  try {
    const { videoId, progress, duration } = req.body;
    const userId = req.user.id;

    // 1. Safe "Find or Create" to prevent race conditions
    let watch = await WatchProgress.findOneAndUpdate(
      { userId, videoId },
      { 
        $setOnInsert: { userId, videoId, lastMilestone: 0, completed: false } 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 2. Calculate Status
    const percentage = (progress / duration) * 100;
    const completed = percentage >= 95;

    // --- REWATCH LOGIC ---
    // Reset if user restarts video (progress < 10s) after finishing it
    if (watch.completed && progress < 10) {
       console.log("🔄 Rewatch detected: Resetting milestones");
       watch.lastMilestone = 0; 
       watch.completed = false; 
    }

    // 3. Update memory fields
    watch.progress = progress;
    watch.completed = completed || watch.completed; 

    // --- CUMULATIVE AI LOGIC ---
    // We use 'weight' accumulator and independent IF checks (no 'else')
    let weight = 0;
    let newMilestone = watch.lastMilestone; // Start with current DB value

    // Check 25% Milestone
    // If we passed 25% AND haven't credited it yet
    if (percentage >= 25 && watch.lastMilestone < 25) {
        weight += 0.05; 
        newMilestone = 25;
    } 
    
    // Check 50% Milestone
    // Note: We check against 'watch.lastMilestone' (the original DB value) 
    // to ensure we credit this step even if we just credited the 25% step above.
    if (percentage >= 50 && watch.lastMilestone < 50) {
        weight += 0.10; 
        newMilestone = 50;
    }

    // Check 75% Milestone
    if (percentage >= 75 && watch.lastMilestone < 75) {
        weight += 0.15; 
        newMilestone = 75;
    }

    // Check Completion (100%)
    if (completed && watch.lastMilestone < 100) {
        weight += 0.20; 
        newMilestone = 100;
    }

    // --- TRIGGER AI UPDATE ---
    if (weight > 0) {
        console.log(`🚀 AI Update: User crossed milestones. Total accumulated weight: ${weight.toFixed(2)}`);
        
        try {
            await updateUserVector(userId, videoId, weight);
            console.log("✅ AI Update Success!");
            
            // Only update the milestone in DB if AI update succeeded
            watch.lastMilestone = newMilestone;
        } catch (error) {
            console.error("❌ AI Update FAILED:", error);
        }
    }

    // 4. Save changes
    await watch.save();
    res.json({ success: true, watch });

  } catch (err) {
    console.error("Progress Error:", err);
    res.status(500).json({ message: "Failed to update progress" });
  }
};

/* ================= Continue Watching & Get Progress ================= */

export const getContinueWatching = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await WatchProgress.find({ userId, completed: false })
      .populate("videoId")
      .sort({ updatedAt: -1 })
      .limit(10);

    const validData = data.filter(item => item.videoId !== null);
    res.json(validData);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};

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