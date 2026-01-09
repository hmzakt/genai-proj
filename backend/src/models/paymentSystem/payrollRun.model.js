import mongoose from "mongoose";

const payrollRunSchema = new mongoose.Schema(
  {
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "REVIEWED", "APPROVED", "PAID"],
      default: "DRAFT",
    },
    createdBy: { type: String }, // Firebase UID
    approvedBy: { type: String }, // Firebase UID
    approvedAt: { type: Date },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("PayrollRun", payrollRunSchema);
