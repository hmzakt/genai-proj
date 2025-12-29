import google from "googleapis";
import oauth2Client from "./googleAuth.js";

const drive = google.drive({version : "v3", auth : oauth2Client});

async function fetchPdf(limit){
    const res = await drive.files.list({
    q: "mimeType='application/pdf'",
    pageSize: limit,
    fields: "files(id, name)",
    });
    return res.data.files;
}

async function downloadFile(fileId) {
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "arraybuffer" }
  );

  return Buffer.from(res.data);
}

export default {
    fetchPdf,
    downloadFile
};