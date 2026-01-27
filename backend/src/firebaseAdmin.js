import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bucketName = process.env.STORAGE_BUCKET;

// Load service account from environment variable or fallback to local file for development
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  // Production: Read from environment variable (base64 encoded or JSON string)
  try {
    const keyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    // Try to parse as base64 first
    if (keyString.length > 1000 && !keyString.includes('{')) {
      serviceAccount = JSON.parse(
        Buffer.from(keyString, 'base64').toString('utf-8')
      );
    } else {
      // Parse as JSON string directly
      serviceAccount = JSON.parse(keyString);
    }
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error.message);
    process.exit(1);
  }
} else {
  // Development: Load from local file (NOT for production)
  try {
    const keyPath = path.join(__dirname, "serviceAccountKey.json");
    if (fs.existsSync(keyPath)) {
      const keyData = fs.readFileSync(keyPath, 'utf-8');
      serviceAccount = JSON.parse(keyData);
    } else {
      console.error("serviceAccountKey.json not found and FIREBASE_SERVICE_ACCOUNT_KEY env var not set");
      process.exit(1);
    }
  } catch (error) {
    console.error("Failed to load serviceAccountKey.json:", error.message);
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: bucketName
});

export const bucket = admin.storage().bucket();

export default admin;