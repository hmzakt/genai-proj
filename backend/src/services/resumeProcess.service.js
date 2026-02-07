import axios from "axios"

const AI_SERVICE_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const AI_PROCESS_PATH = "/process-resume";
const aiProcessUrl = new URL(AI_PROCESS_PATH, AI_SERVICE_BASE_URL).toString();

async function processResume(resumeUrl, jobDescription) {
    console.log("\n" + "=".repeat(60));
    console.log(" Calling AI Service");
    console.log("=".repeat(60));
    console.log(` AI Service URL: ${aiProcessUrl}`);
    console.log(` Resume URL: ${resumeUrl}`);
    console.log(` Job Description Length: ${jobDescription?.length || 0} chars`);

    try {
        const response = await axios.post(aiProcessUrl, {
            resume_url: resumeUrl,
            job_description: jobDescription
        });
        console.log(` AI Service Response Status: ${response.status}`);
        console.log(` Result: ${JSON.stringify(response.data).substring(0, 100)}...`);
        console.log("=".repeat(60) + "\n");
        return response.data;
    } catch (error) {
        console.error(" AI Service Error:");
        console.error(`  Status: ${error.response?.status || 'N/A'}`);
        console.error(`  Message: ${error.message}`);
        console.error(`  Response: ${JSON.stringify(error.response?.data || {})}`);
        console.error("=".repeat(60) + "\n");
        throw error;
    }
}

export default processResume;