import User from "../models/user.model.js";
import Video from "../models/video.model.js";
const normalize = (vector) => {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vector; // Prevent divide by zero
    return vector.map(val => val / magnitude);
};

export const updateUserVector = async (userId, videoId, weight) => {
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            // 1. Fetch User & Video
            // We re-fetch inside the loop so we always get the latest version (prevents VersionError)
            const user = await User.findById(userId);
            
            // ✅ UPDATED: Select '+embedding'
            const video = await Video.findById(videoId).select("+embedding");

            // Validation
            if (!user || !video) return;
            
            // Check if video actually has the vector data
            if (!video.embedding || video.embedding.length === 0) {
                console.error(`❌ AI Error: Video "${video.title}" has missing embeddings.`);
                return;
            }

            // 2. Math Logic
            let currentVector = user.preferencesVector;

            if (!currentVector || currentVector.length === 0) {
                // Cold Start: Adopt the video's embedding 100%
                user.preferencesVector = video.embedding;
            } else {
                // Weighted Average: Move user closer to video
                const blendedVector = currentVector.map((val, i) => {
                    return (val * (1 - weight)) + (video.embedding[i] * weight);
                });

                // ✅ NEW: Normalize the result before saving
                user.preferencesVector = normalize(blendedVector);
            }

            // 3. Mark & Save
            user.markModified("preferencesVector");
            await user.save();
            
            console.log(`🤖 AI Updated (Attempt ${attempt + 1})`);
            return; // Success! Exit the function.

        } catch (error) {
            // 4. Handle Version Error (Race Conditions)
            if (error.name === 'VersionError') {
                attempt++;
                console.log(`⚠️ Database Conflict (VersionError). Retrying... (${attempt}/${MAX_RETRIES})`);
                // Wait a tiny bit (50ms) before retrying
                await new Promise(resolve => setTimeout(resolve, 50)); 
            } else {
                // If it's a real error (not a conflict), log and exit
                console.error("❌ AI Update Error:", error);
                return; 
            }
        }
    }
    
    console.error("❌ Failed to update User Vector after maximum retries.");
};