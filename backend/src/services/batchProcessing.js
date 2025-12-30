import Candidate from "../models/candidate.model.js";
import Batch from "../models/batches.model.js";
import Job from "../models/job.model.js";
import processResume from "./resumeProcess.service.js";

async function processBatch(batchId) {
    const batch = await Batch.findById(batchId);
    if (!batch) throw new Error("Batch not found");

    if (batch.status !== "pending") {
        throw new Error("Batch is either processed earlier or being processed");
    }

    batch.status = "processing";
    await batch.save();

    const job = await Job.findById(batch.jobId)
    const candidates = await Candidate.find({
        batchId: batch._id,
        status: "uploaded"
    });

    for (const candidate of candidates) {
        try {
            // Add a delay to respect API Rate Limits (Free Tier)
            await new Promise(resolve => setTimeout(resolve, 4000));

            const aiResponse = await processResume(
                candidate.resumeUrl,
                job.description
            );
            candidate.name = aiResponse.name || candidate.name;
            candidate.email = aiResponse.email || candidate.email;
            candidate.score = aiResponse.score;
            candidate.skills = aiResponse.skills || [];
            candidate.experience = aiResponse.experience || 0;
            candidate.summary = aiResponse.summary;
            candidate.status = "processed";

            await candidate.save();

            batch.processedCount += 1;
            await batch.save();
        } catch (error) {
            console.error("Error processing candidate:", error);
            candidate.status = "failed";
            await candidate.save();
        }
    }
    batch.status = "completed";
    await batch.save();
    return true;
}

export default processBatch;