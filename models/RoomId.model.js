import mongoose from "mongoose";

const roomIdSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model("RoomId", roomIdSchema);