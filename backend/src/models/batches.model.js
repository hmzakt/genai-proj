import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    source: {
        type: String,
        enum: ["local", "gdrive"],
        default: "local"
    },
    totalResumes: {
        type: Number,
        default: 0
    },
    processedCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
    }
}, { timestamps: true });

export default mongoose.model("Batch", batchSchema);