import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:"hr-ai-proj.appspot.com"
});

const bucket = admin.storage().bucket();

export default admin;