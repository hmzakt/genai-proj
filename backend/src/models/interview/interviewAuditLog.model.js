import mongoose from "mongoose";

const interviewAuditLogSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },

    event: {
      type: String,
      enum: [
        "INTERVIEW_CREATED",
        "INTERVIEW_STARTED",
        "QUESTION_ANSWERED",
        "INTERVIEW_COMPLETED",
        "INTERVIEW_EXPIRED",
      ],
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

export default mongoose.model(
  "InterviewAuditLog",
  interviewAuditLogSchema
);
