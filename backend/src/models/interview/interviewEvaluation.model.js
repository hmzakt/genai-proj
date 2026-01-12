import mongoose from "mongoose";

const interviewEvaluationSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      unique: true,
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    communicationScore: {
      type: Number,
      min: 0,
      max: 10,
    },

    technicalScore: {
      type: Number,
      min: 0,
      max: 10,
    },

    clarityScore: {
      type: Number,
      min: 0,
      max: 10,
    },

    strengths: { type: String },
    weaknesses: { type: String },
    aiSummary: { type: String },

    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "InterviewEvaluation",
  interviewEvaluationSchema
);
