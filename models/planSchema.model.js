import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["basic", "standard", "premium"],
    unique: true
  },
  price: Number,
  durationInDays: Number,
  maxDevices: Number,
  videoQuality: String
});

export default mongoose.model("Plan", planSchema);
