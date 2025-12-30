import mongoose from "mongoose"

const candidateSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },

    name: String,
    email: String,

    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
    },

    resumeUrl: String,

    status: {
        type: String,
        enum: ["uploaded", "processed", "failed"],
        default: "uploaded",
    },
    score: Number,
    summary: String,
    skills: [String],
    experience: Number,
    score: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Candidate", candidateSchema)