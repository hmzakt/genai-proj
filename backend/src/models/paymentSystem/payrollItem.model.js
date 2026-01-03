import mongoose from "mongoose";

const payrollItemSchema = new mongoose.Schema(
  {
    payrollRunId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PayrollRun",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    baseSalary: Number,
    incentive: Number,
    bonus: Number,
    deductions: Number,
    tax: Number,
    grossPay: Number,
    netPay: Number,
    currency: { type: String, default: "INR" },
  },
  { timestamps: true }
);

export default mongoose.model("PayrollItem", payrollItemSchema);
