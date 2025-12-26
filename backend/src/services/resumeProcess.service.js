import axios from "axios"

const py_url = "http://localhost:8000/process-resume";

async function processResume(resumeUrl, jobDescription){
    const response = await axios.post(py_url,{
        resume_url: resumeUrl,
        job_description:jobDescription
    });
    return response.data;
}

export default processResume;