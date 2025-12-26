import express from "express"
import  { authenticate } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js"
import bucket from "../firebaseAdmin.js"
import Company from "../models/company.model.js"
import Candidate from "../models/candidate.model.js"
import Job from "../models/job.model.js"
import processResume from "../services/resumeProcess.service.js"

const router = express.Router();

router.post(
    "/upload/:jobId",
    authenticate,
    upload.single("resume"),
    async(req, res)=>{
        const {jobId} = req.params;
        const {name,email}=req.body;

        if(!req.file){
            return res.status(400).json({message:"Resume file required"})
        }

        const company = await Company.findOne({
            firebaseUid:req.user.uid
        });

        const fileName = `resume/${company._id}/${Date.now()}_${req.file.originalname}`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer,{
            metadata:{
                contentType:req.file.mimetype
            }
        });

        await file.makePublic();
        const resumeUrl = file.publicUrl();

        const candidate = await Candidate.create({
            jobId,
            companyId:company._id,
            name,
            email,
            resumeUrl
        });

        const job = await Job.findById(jobId);
        const result = await processResume(
            resumeUrl,
            job.description
        );

        candidate.score = result.score;
        candidate.status = result.status||"processed";
        candidate.summary = result.summary;

        await candidate.save();

        res.json(candidate);
    }
);

export default router;