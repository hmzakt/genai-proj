import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    employeeCode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        requied: true
    },
    department: {
        type: String
    },
    role: {
        type: String
    },
    dateOfJoining: {
        type: Date,
        requied: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "ON_HOLD", "EXITED"],
        default: "ACTIVE"
    }
}, { timestamps: true })

export default mongoose.model("Employee", employeeSchema);