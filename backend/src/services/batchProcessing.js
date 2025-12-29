import Candidate from "../models/candidate.model";
import Batch from "../models/batches.model";
import Job from "../models/job.model";
import processResume from "./resumeProcess.service";

async function processBatch(batchId){
    const batch = await Batch.findById(batchId);
    if(!batch) throw new Error("Batch not found");

    if(batch.status !== "pending"){
        throw new Error("Batch is either processed earlier or being processed");
    }

    batch.status = "processing";
    await batch.save();

     const job = await Job.findById(batch.jobId)
     const candidates = await Candidate.find({
        batchId : batch._id,
        status : "uploaded"
     });

     for (const candidate of candidates){
        try{
            const aiResponse = await processResume(
                candidate.resumeUrl,
                job.description
            );
            candidate.score = aiResponse.score;
            candidate.skills = aiResponse.skills || [];
            candidate.experience = aiResult.experience ||0;
            candidate.summary = aiResult.summary;
            candidate.status = "processed";

            await candidate.save();

            batch.processedCount += 1;
            await batch.save();
        }catch(error){
            candidate.status = "failed";
            await candidate.save();
        }
     }
     batch.status = "completed";
     await batch.save();
     return true;
}

export default processBatch;