import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema({
    employeeCode : {
        type : String,
        unique : true,
        required : true 
    },
    name : {
        type : String,
        required : true 
    },
    email : {
        type : String,
        requied : true 
    },
    department : {
        type : String 
    },
    role : {
        type : String 
    },
    dateOfJoining : {
        type : Date,
        requied : true 
    },
    status : {
        type : String,
        enum : ["ACTIVE", "ON_HOLD", "EXITED"],
        default : "ACTIVE"
    }
}, {timestamps : true})

export default mongoose.model("Employee", employeeSchema);