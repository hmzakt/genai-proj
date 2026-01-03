import mongoose from "mongoose";

const payrollProfileSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "CONTRACT", "INTERN"],
      required: true,
    },
    baseSalary: { type: Number, required: true },
    payFrequency: {
      type: String,
      enum: ["MONTHLY", "DAILY"],
      default: "MONTHLY",
    },
    currency: { type: String, default: "INR" },
    incentivePlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncentivePlan",
    },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("PayrollProfile", payrollProfileSchema);
