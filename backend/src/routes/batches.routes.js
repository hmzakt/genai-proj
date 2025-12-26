import express from "express"
import authentication from "../middlewares/auth.middleware.js"
import Company from "../models/company.model.js"
import Batch from "../models/batches.model.js"

const router = express.Router();

router.post("/create",authentication, async(req,res)=>{
    const{jobId, source, limit} = req.body;
    if(!jobId || !source || !limit){
        return res.status(400).json({message : "Missing fields one or more"});
    }

    const company = await Company.findOne({
        firebaseUid: req.user.uid              
    })

    const batch = await Batch.create({
        jobId,
        companyIdn : company._id,
        source, 
        totalResume : limit
    });
    res.json(batch);
});

export default router;