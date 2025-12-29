import express from "express"
import authentication, { authenticate } from "../middlewares/auth.middleware.js"
import Company from "../models/company.model.js"
import Batch from "../models/batches.model.js"
import Candidate from "../models/candidate.model.js";

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


router.post("/:batchId/process", authenticate, async (req,res)=>{
    try{
        await processBatch(req.params.batchId);
        res.json({message : "Batch processed successfully"});
    } catch(err){
        res.status(400).json({message : err.message});
    }
});

router.get("/:batchId/results", authenticate, async(req, res)=>{
    const candidates = await Candidate.find({
        batchId:req.params.batchId,
        status : "processed"
    }).sort({score : -1});

    res.json(candidates)
});

export default router;