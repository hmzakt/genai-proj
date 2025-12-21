import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.firebaseauthapi,
  authDomain: "hr-ai-proj.firebaseapp.com",
  projectId: "hr-ai-proj",
  storageBucket: "hr-ai-proj.firebasestorage.app",
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);