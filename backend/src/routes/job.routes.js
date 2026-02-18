import express from "express"
import { authenticate } from "../middlewares/auth.middleware.js";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";
import Batch from "../models/batches.model.js";
import Candidate from "../models/candidate.model.js";


const router = express.Router();


router.post("/", authenticate, async (req, res) => {
  const { title, description } = req.body;

  const company = await Company.findOne({
    firebaseUid: req.user.uid,
  });

  const job = await Job.create({
    companyId: company._id,
    title,
    description,
  });

  res.json(job);
});

// List jobs
router.get("/", authenticate, async (req, res) => {
  const company = await Company.findOne({
    firebaseUid: req.user.uid,
  });

  const jobs = await Job.find({ companyId: company._id });
  res.json(jobs);
});

// Delete job
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const company = await Company.findOne({
      firebaseUid: req.user.uid,
    });

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (!job.companyId.equals(company._id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Cascading delete
    await Promise.all([
      Candidate.deleteMany({ jobId: req.params.id }),
      Batch.deleteMany({ jobId: req.params.id }),
      Job.findByIdAndDelete(req.params.id)
    ]);

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
