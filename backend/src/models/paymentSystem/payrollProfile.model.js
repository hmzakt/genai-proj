import mongoose from "mongoose";
import { encryptNumber, decryptNumber } from "../../utils/crypto.util.js";

const ENCRYPTED_NUMBER_FIELDS = ["baseSalary"];

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
    baseSalary: { type: mongoose.Schema.Types.Mixed, required: true },
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

// Encrypt
payrollProfileSchema.pre("save", async function () {
  for (const field of ENCRYPTED_NUMBER_FIELDS) {
    if (this.isModified(field) && this[field] !== undefined) {
      this[field] = encryptNumber(this[field]);
    }
  }
});

// Decrypt 
payrollProfileSchema.post("init", function () {
  try {
    for (const field of ENCRYPTED_NUMBER_FIELDS) {
      if (this[field] !== undefined) {
        this[field] = decryptNumber(this[field]);
      }
    }
  } catch (err) {
    console.error("PayrollProfile decryption error:", err.message);
  }
});

export default mongoose.model("PayrollProfile", payrollProfileSchema);
