import { google } from "googleapis"

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5000/auth/google/callback"
)

const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

function setCredentials(tokens) {
  oauth2Client.setCredentials(tokens);
}

export default {oauth2Client, getAuthUrl, setCredentials};