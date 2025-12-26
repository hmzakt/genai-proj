import mongoose from "mongoose"

const candidateSchema = new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job"
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company"
    },

    name:String,
    email:String,
    resumeUrl:String,

    status:{
        type:String,
        enum:["pending","processed"],
        default:"pending",
    },
    score:Number
},{timestamps:true});

export default mongoose.model("Candidate", candidateSchema)