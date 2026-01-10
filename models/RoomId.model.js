// models/RoomId.model.js
import mongoose from "mongoose";

const roomIdSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    // Optional: Add movieId if you want to restrict the room to a specific film
    movieId: { type: String },
    adminId: { type: String, required: true }, // Store Host's User ID
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        socketId: {
          type: String,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("RoomId", roomIdSchema);
