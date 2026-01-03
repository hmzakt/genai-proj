import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

export default mongoose.model("BankAccount", bankAccountSchema);

// TODO: Add encryption when saving