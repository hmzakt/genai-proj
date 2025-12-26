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
    
    batchId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Batch"
    },

    resumeUrl:String,

    status:{
        type:String,
        enum:["uploaded","processed"],
        default:"uploaded",
    },
    score:Number
},{timestamps:true});

export default mongoose.model("Candidate", candidateSchema)