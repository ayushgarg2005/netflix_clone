import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: Number,

    currency: {
      type: String,
      default: "INR"
    },

    paymentProvider: {
      type: String,
      enum: ["razorpay", "stripe", "paypal"]
    },

    paymentId: String,

    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending"
    },

    plan: String
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
