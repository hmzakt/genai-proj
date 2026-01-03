import mongoose from "mongoose";

const paymentLogSchema = new mongoose.Schema(
  {
    payrollItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PayrollItem",
      required: true,
    },
    provider: { type: String, required: true },
    transactionId: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "PENDING",
    },
    initiatedAt: { type: Date, default: Date.now },
    rawResponse: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("PaymentLog", paymentLogSchema);
