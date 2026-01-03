import mongoose from "mongoose";

const payrollMetricsSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    hoursWorked: { type: Number, default: 0 },
    salesAmount: { type: Number, default: 0 },
    performanceScore: { type: Number },
    manualBonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("PayrollMetrics", payrollMetricsSchema);
