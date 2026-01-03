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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("PayrollRun", payrollRunSchema);
