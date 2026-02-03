import axios from "axios"

const AI_SERVICE_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const AI_PROCESS_PATH = "/process-resume";
const aiProcessUrl = new URL(AI_PROCESS_PATH, AI_SERVICE_BASE_URL).toString();

async function processResume(resumeUrl, jobDescription){
    const response = await axios.post(aiProcessUrl,{
        resume_url: resumeUrl,
        job_description:jobDescription
    });
    return response.data;
}

export default processResume;