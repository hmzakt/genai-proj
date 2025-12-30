import "dotenv/config";
import admin from "firebase-admin";
import { createRequire } from "module";
import fs from "fs";

const require = createRequire(import.meta.url);
const serviceAccount = require("../src/serviceAccountKey.json");

function log(msg) {
    console.log(msg);
    fs.appendFileSync("verify-storage.log", msg + "\n");
}

// Clear log file
fs.writeFileSync("verify-storage.log", "");

const bucketName = process.env.STORAGE_BUCKET;

log("----------------------------------------");
log("Storage Verification Script");
log("----------------------------------------");
log(`Loaded STORAGE_BUCKET: '${bucketName}'`);

if (!bucketName) {
    log("❌ ERROR: STORAGE_BUCKET is not set in .env file");
    process.exit(1);
}

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: bucketName
    });

    const bucket = admin.storage().bucket();
    log("✅ Authenticated with Service Account: " + serviceAccount.project_id);
    log("Attempting to access bucket...");

    const [exists] = await bucket.exists();

    if (exists) {
        log("✅ SUCCESS! Bucket exists and is accessible.");
        log(`Bucket Name: ${bucket.name}`);
    } else {
        log("❌ ERROR: Bucket does NOT exist (or 403 Forbidden).");
        log(`Requested Bucket: ${bucketName}`);

        // Try the standard convention
        const defaultBucketName = `${serviceAccount.project_id}.appspot.com`;
        log(`\n🔄 Attempting check with standard convention: '${defaultBucketName}'...`);
        const fallbackBucket = admin.storage().bucket(defaultBucketName);
        const [fallbackExists] = await fallbackBucket.exists();

        if (fallbackExists) {
            log("✅ FOUND IT! The correct bucket name is: " + defaultBucketName);
            log("👉 Please update your .env file to use THIS name.");
        } else {
            log("❌ Standard convention also failed. Please check Firebase Console -> Storage.");
        }
    }

} catch (error) {
    log("❌ EXCEPTION DURING CHECK:");
    log(error.message);
    log(JSON.stringify(error, null, 2));
}
log("----------------------------------------");
