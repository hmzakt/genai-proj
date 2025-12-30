import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Just check if the uploads endpoint is serving 
// Since we don't have a valid token to upload, we can try to hit the root and see if it's running
// Or create a dummy file in uploads and try to fetch it

const BASE_URL = "http://localhost:5000";

async function verify() {
    console.log("Verifying Local Storage Setup...");

    // 1. Create a dummy file in uploads manually to test static serving
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }
    const testFileName = `test-${Date.now()}.txt`;
    fs.writeFileSync(path.join(uploadsDir, testFileName), "Hello World");

    const fileUrl = `${BASE_URL}/uploads/${testFileName}`;
    console.log(`Checking URL: ${fileUrl}`);

    try {
        const response = await axios.get(fileUrl);
        if (response.data === "Hello World") {
            console.log("✅ SUCCESS: Static file serving is working!");
        } else {
            console.log("❌ FAILED: File content mismatch.");
        }
    } catch (error) {
        console.error("❌ FAILED: Could not access file.", error.message);
    }

    // Cleanup
    try {
        fs.unlinkSync(path.join(uploadsDir, testFileName));
    } catch (e) { }
}

verify();
