import express from "express"
import { authenticate } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js"
import Company from "../models/company.model.js"
import Candidate from "../models/candidate.model.js"
import Job from "../models/job.model.js"
import processResume from "../services/resumeProcess.service.js"
import Batch from "../models/batches.model.js"
import driveService from "../services/driveService.js"
import storage from "../storage/localStorage.js"
const router = express.Router();

router.post(
  "/batch-upload/:batchId",
  authenticate,
  upload.array("resumes", 50),
  async (req, res) => {
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(400).json({ message: "Batch not defined" })
    };

    const company = await Company.findOne({
      firebaseUid: req.user.uid
    });

    const candidates = [];

    for (const file of req.files) {

      const resumeUrl = await storage.saveFile(file);
      await storage.cleanupIfNeeded();

      const candidate = await Candidate.create({
        jobId: batch.jobId,
        companyId: company._id,
        batchId: batch._id,
        resumeUrl
      });

      candidates.push(candidate);
    }

    res.json({
      uploaded: candidates.length,
      candidates
    });
  }
);

router.post("/batch-upload-gdrive/:batchId", authenticate, async (req, res) => {
  const { batchId } = req.params;

  const batch = await Batch.findById(batchId);
  if (!batch) return res.status(404).json({ message: "Batch not found" });

  const company = await Company.findOne({
    firebaseUid: req.user.uid,
  });

  // Use the default export object
  const files = await driveService.fetchPdf(batch.totalResumes);
  const candidates = [];

  for (const file of files) {
    const buffer = await driveService.downloadFile(file.id);

    // Mock file object for localStorage.saveFile
    const mockFile = {
      originalname: file.name,
      buffer: buffer
    };

    const resumeUrl = await storage.saveFile(mockFile);
    await storage.cleanupIfNeeded();

    const candidate = await Candidate.create({
      jobId: batch.jobId,
      companyId: company._id,
      batchId: batch._id,
      resumeUrl: resumeUrl,
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