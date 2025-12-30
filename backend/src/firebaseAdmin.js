import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

const bucketName = process.env.STORAGE_BUCKET;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: bucketName
});

export const bucket = admin.storage().bucket();

export default admin;