import mongoose from "mongoose";

const taxProfileSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    taxRegime: { type: String }, 
    taxId: { type: String }, 
    exemptions: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("TaxProfile", taxProfileSchema);
