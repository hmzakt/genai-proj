// services/interview.service.js
import crypto from "crypto";
import Interview from "../models/interview/interview.model.js";

export async function createInterview(data) {
  const token = crypto.randomBytes(32).toString("hex");

  return Interview.create({
    ...data,
    accessToken: token,
    status: "SCHEDULED",
  });
}

export async function validateInterview(req, res) {
  const interview = await Interview.findOne({
    accessToken: req.query.token,
  });

  if (!interview) return res.status(404).json({ error: "Invalid link" });

  const now = new Date();

  if (now < interview.scheduledStart)
    return res.status(403).json({ error: "Interview not started" });

  if (now > interview.scheduledEnd)
    return res.status(403).json({ error: "Interview expired" });

  if (interview.status === "COMPLETED")
    return res.status(403).json({ error: "Already completed" });

  res.json({ valid: true, interviewId: interview._id });
}


export async function startInterview(req, res) {
  const interview = await Interview.findById(req.body.interviewId);

  if (interview.status !== "SCHEDULED")
    return res.status(400).json({ error: "Invalid state" });

  interview.status = "ACTIVE";
  interview.startedAt = new Date();
  await interview.save();

  res.json({ started: true });
}
