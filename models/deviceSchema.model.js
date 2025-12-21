const deviceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deviceName: String,
    ipAddress: String,
    lastActive: Date
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);
