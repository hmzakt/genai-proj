import express from "express"
import {getAuthUrl, setCredentials, oauth2Client} from "../services/googleAuth.js"

const router= express.Router();

router.get("/google", (req,res) => {
    res.redirect(getAuthUrl());
});

router.get("/google/callback" , async(req,res) => {
    const {code} = req.query;

    const {tokens} = await oauth2Client.getToken(code);
    setCredentials(tokens);

    res.send("Google drive connected. Close this tab");
});

export default router;