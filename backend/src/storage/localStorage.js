import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const MAX_PDFS = 500;

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}


async function saveFile(file) {
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  try {
    fs.writeFileSync(filePath, file.buffer);
    console.log(`File saved successfully: ${fileName}`);
  } catch (error) {
    console.error(`Error saving file ${fileName}:`, error);
    throw new Error(`Failed to save file: ${error.message}`);
  }

  // Validate BASE_URL is set
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    console.error(" CRITICAL: BASE_URL environment variable is not set!");
    console.error(" This will cause resume processing to fail in production.");
    console.error(" Please set BASE_URL to your backend URL (e.g., https://your-backend.com)");
    throw new Error("BASE_URL environment variable is required but not set");
  }

  const fullUrl = `${baseUrl}/uploads/${fileName}`;
  console.log(`Generated resume URL: ${fullUrl}`);

  return fullUrl;
}


async function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}


async function cleanupIfNeeded() {
  const files = fs
    .readdirSync(UPLOAD_DIR)
    .map(name => ({
      name,
      time: fs.statSync(path.join(UPLOAD_DIR, name)).birthtimeMs,
    }))
    .sort((a, b) => a.time - b.time);

  if (files.length <= MAX_PDFS) return;

  const excess = files.length - MAX_PDFS;

  for (let i = 0; i < excess; i++) {
    const filePath = path.join(UPLOAD_DIR, files[i].name);
    fs.unlinkSync(filePath);
  }
}

export default {
  saveFile,
  deleteFile,
  cleanupIfNeeded,
};
