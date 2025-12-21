import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  title: String,
  description: String,
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
