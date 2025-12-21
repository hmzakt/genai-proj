import express from "express"
import Company from "../models/company.model.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/init", auth, async (req, res) => {
  const { uid, email } = req.user;

  let company = await Company.findOne({ firebaseUid: uid });

  if (!company) {
    company = await Company.create({
      firebaseUid: uid,
      email,
      name: email.split("@")[0],
    });
  }

  res.json(company);
});

export default router;
