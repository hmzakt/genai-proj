import mongoose from "mongoose";

const incentivePlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["PERFORMANCE", "SALES", "ATTENDANCE", "CUSTOM"],
      required: true,
    },
    rules: [
      {
        metric: String,
        condition: String, // >=, <=, ==
        value: Number,
      },
    ],
    payoutType: {
      type: String,
      enum: ["FIXED", "PERCENTAGE"],
      required: true,
    },
    capAmount: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("IncentivePlan", incentivePlanSchema);
