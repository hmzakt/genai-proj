import mongoose from "mongoose";

const interviewAnswerSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewQuestion",
      required: true,
    },

    answerText: { type: String, required: true },

    answerDuration: {
      type: Number, // seconds
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "InterviewAnswer",
  interviewAnswerSchema
);
