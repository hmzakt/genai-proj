import express from "express"
import { authenticate } from "../middlewares/auth.middleware.js";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";


const router = express.Router();


router.post("/", auth, async (req, res) => {
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
router.get("/", auth, async (req, res) => {
  const company = await Company.findOne({
    firebaseUid: req.user.uid,
  });

  const jobs = await Job.find({ companyId: company._id });
  res.json(jobs);
});

module.exports = router;
