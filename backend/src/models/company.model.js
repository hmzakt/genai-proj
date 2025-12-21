import mongoose  from "mongoose";
const companySchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: String,
  email: String,
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
