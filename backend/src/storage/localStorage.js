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

  fs.writeFileSync(filePath, file.buffer);

  // Return relative path. Frontend should prepend API_URL or we return full URL.
  // Returning full URL is safer for flexibility.
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  return `${baseUrl}/uploads/${fileName}`;
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
