import mongoose from "mongoose";

const interviewQuestionSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },

    questionText: { type: String, required: true },

    category: { type: String }, 

    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
    },

    expectedSkills: [{ type: String }],

    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model(
  "InterviewQuestion",
  interviewQuestionSchema
);
