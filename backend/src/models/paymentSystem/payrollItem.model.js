import mongoose from "mongoose";
import { encryptNumber, decryptNumber } from "../../utils/crypto.util.js";

const ENCRYPTED_NUMBER_FIELDS = [
  "baseSalary",
  "incentive",
  "bonus",
  "deductions",
  "tax",
  "grossPay",
  "netPay",
];

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

    baseSalary: { type: mongoose.Schema.Types.Mixed },
    incentive: { type: mongoose.Schema.Types.Mixed },
    bonus: { type: mongoose.Schema.Types.Mixed },
    deductions: { type: mongoose.Schema.Types.Mixed },
    tax: { type: mongoose.Schema.Types.Mixed },
    grossPay: { type: mongoose.Schema.Types.Mixed },
    netPay: { type: mongoose.Schema.Types.Mixed },
    currency: { type: String, default: "INR" },
  },
  { timestamps: true }
);

// Encrypt 
payrollItemSchema.pre("save", async function () {
  for (const field of ENCRYPTED_NUMBER_FIELDS) {
    if (this.isModified(field) && this[field] !== undefined) {
      this[field] = encryptNumber(this[field]);
    }
  }
});

// Decrypt 
payrollItemSchema.post("init", function () {
  try {
    for (const field of ENCRYPTED_NUMBER_FIELDS) {
      if (this[field] !== undefined) {
        this[field] = decryptNumber(this[field]);
      }
    }
  } catch (err) {
    console.error("PayrollItem decryption error:", err.message);
  }
});

export default mongoose.model("PayrollItem", payrollItemSchema);
