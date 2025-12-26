import express from "express"
import  { authenticate } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js"
import bucket from "../firebaseAdmin.js"
import Company from "../models/company.model.js"
import Candidate from "../models/candidate.model.js"
import Job from "../models/job.model.js"
import processResume from "../services/resumeProcess.service.js"
import Batch from "../models/batches.model.js"
const router = express.Router();

// router.post(
//     "/upload/:jobId",
//     authenticate,
//     upload.single("resume"),
//     async(req, res)=>{
//         const {jobId} = req.params;
//         const {name,email}=req.body;

//         if(!req.file){
//             return res.status(400).json({message:"Resume file required"})
//         }

//         const company = await Company.findOne({
//             firebaseUid:req.user.uid
//         });

//         const fileName = `resume/${company._id}/${Date.now()}_${req.file.originalname}`;
//         const file = bucket.file(fileName);

//         await file.save(req.file.buffer,{
//             metadata:{
//                 contentType:req.file.mimetype
//             }
//         });

//         await file.makePublic();
//         const resumeUrl = file.publicUrl();

//         const candidate = await Candidate.create({
//             jobId,
//             companyId:company._id,
//             name,
//             email,
//             resumeUrl
//         });

//         const job = await Job.findById(jobId);
//         const result = await processResume(
//             resumeUrl,
//             job.description
//         );

//         candidate.score = result.score;
//         candidate.status = result.status||"processed";
//         candidate.summary = result.summary;

//         await candidate.save();

//         res.json(candidate);
//     }
// );

router.post(
    "/batch-upload/:batchId",
    authenticate,
    upload.array("resumes",50),
    async(req,res)=>{
        const {batchId} = req.params;
        const batch = await Batch.findById(batchId);
        if(!batch){
            return res.status(400).json({message : "Batch not defined"})
        };

        const company = Company.findOne({
            firebaseUid : req.user.uid
        });

        const candidates = [];

        for (const file of req.files){
            const fileName = `resume/${company._id}/${batchId}/${Date.now()}_${file.originalname}`;
            const storageFile = bucket.file(fileName);

            await storageFile.save(file.buffer, {
                metadata : {contentType : file.mimetype}
            });

            await storageFile.makePublic();

            const candidate  = await Candidate.create({
                jobId : batch.jobId,
                companyId : company._id,
                batchId : batch._id,
                resumeUrl : storageFile.publicUrl()
            });

            candidates.push(candidate);
        }

        res.json({
            uploaded: candidates.length,
            candidates
        });
    }
);

export default router;