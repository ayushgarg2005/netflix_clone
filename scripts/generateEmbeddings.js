import mongoose from "mongoose";
import dotenv from "dotenv";
import Video from "../models/video.model.js"; 
import EmbeddingService from "../Utils/aiService.js";

dotenv.config();

const generateAllEmbeddings = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // 2. Fetch all videos (or just those missing vectors)
    // We fetch ALL to ensure everything is up to date
    const videos = await Video.find({});
    console.log(`🔍 Found ${videos.length} videos to process...`);

    // 3. Loop through and update
    for (const video of videos) {
      if (video.contentVector && video.contentVector.length > 0) {
        console.log(`Skipping "${video.title}" (Already has vector)`);
        continue;
      }

      console.log(`🧠 Generating embedding for: "${video.title}"...`);

      // Combine text fields for context
      const textContext = `${video.title} ${video.genre.join(" ")} ${video.description}`;
      
      // Generate Vector
      const vector = await EmbeddingService.generateEmbedding(textContext);

      // Update Database
      video.contentVector = vector;
      await video.save();
      
      console.log(`✅ Saved vector for "${video.title}"`);
    }

    console.log("🎉 All embeddings generated successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error generating embeddings:", error);
    process.exit(1);
  }
};

generateAllEmbeddings();