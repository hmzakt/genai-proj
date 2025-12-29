import express from "express"
import  { authenticate } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js"
import bucket from "../firebaseAdmin.js"
import Company from "../models/company.model.js"
import Candidate from "../models/candidate.model.js"
import Job from "../models/job.model.js"
import processResume from "../services/resumeProcess.service.js"
import Batch from "../models/batches.model.js"
import {fetchPdf, downloadPdf} from "../services/driveService.js"
const router = express.Router();


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

router.post("/batch-upload-gdrive/:batchId", auth, async (req, res) => {
  const { batchId } = req.params;

  const batch = await Batch.findById(batchId);
  if (!batch) return res.status(404).json({ message: "Batch not found" });

  const company = await Company.findOne({
    firebaseUid: req.user.uid,
  });

  const files = await fetchPdf(batch.totalResumes);
  const candidates = [];

  for (const file of files) {
    const buffer = await downloadPdf(file.id);

    const fileName = `resumes/${company._id}/${batchId}/${Date.now()}_${file.name}`;
    const storageFile = bucket.file(fileName);

    await storageFile.save(buffer, {
      metadata: { contentType: "application/pdf" },
    });

    await storageFile.makePublic();

    const candidate = await Candidate.create({
      jobId: batch.jobId,
      companyId: company._id,
      batchId: batch._id,
      resumeUrl: storageFile.publicUrl(),
    });

    candidates.push(candidate);
  }

  res.json({
    source: "google-drive",
    uploaded: candidates.length,
    candidates,
  });
});

export default router;