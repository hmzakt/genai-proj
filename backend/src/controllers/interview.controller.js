import { createInterview } from "../services/interview.service.js";

export async function scheduleInterview(req, res) {
  const interview = await createInterview({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json(interview);
}
