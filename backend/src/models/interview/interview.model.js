import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    scheduledStart: { type: Date, required: true },
    scheduledEnd: { type: Date, required: true },
    timezone: { type: String, default: "UTC" },

    type: {
      type: String,
      enum: ["SCREENING", "TECHNICAL", "MIXED"],
      required: true,
    },

    status: {
      type: String,
      enum: ["SCHEDULED", "ACTIVE", "COMPLETED", "EXPIRED"],
      default: "SCHEDULED",
    },

    accessToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    startedAt: { type: Date },
    completedAt: { type: Date },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
