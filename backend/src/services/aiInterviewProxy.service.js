export async function fetchQuestions(interview) {
  const response = await fetch(
    `${process.env.AI_SERVICE_URL}/interview/questions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: interview.type,
        experience: interview.experienceLevel,
      }),
    }
  );

  return response.json();
}

export async function submitAnswer(req, res) {
  const { interviewId, questionId, answerText } = req.body;

  await InterviewAnswer.create({
    interviewId,
    questionId,
    answerText,
  });

  res.json({ saved: true });
}

import { evaluateInterview } from "../services/aiInterviewProxy.service.js";

export async function completeInterview(req, res) {
  const interview = await Interview.findById(req.body.interviewId);

  interview.status = "COMPLETED";
  interview.completedAt = new Date();
  await interview.save();
  
  evaluateInterview(interview._id);

  res.json({ completed: true });
}

