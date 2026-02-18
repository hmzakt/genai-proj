import mongoose from "mongoose";
import { encrypt, decrypt } from "../../utils/crypto.util.js";

const ENCRYPTED_STRING_FIELDS = ["accountNumber", "ifscCode"];

const bankAccountSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String },
    isPrimary: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    cashfreeBeneficiaryId: { type: String },
    onboardingStatus: {
      type: String,
      enum: ["PENDING", "COMPLETE"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

// Encrypt
bankAccountSchema.pre("save", async function () {
  for (const field of ENCRYPTED_STRING_FIELDS) {
    if (this.isModified(field) && this[field]) {
      this[field] = encrypt(this[field]);
    }
  }
});

// Decrypt 
bankAccountSchema.post("init", function () {
  try {
    for (const field of ENCRYPTED_STRING_FIELDS) {
      if (this[field]) {
        this[field] = decrypt(this[field]);
      }
    }
  } catch (err) {
    console.error("BankAccount decryption error:", err.message);
  }
});

export default mongoose.model("BankAccount", bankAccountSchema);