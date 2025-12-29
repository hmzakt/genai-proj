import express from "express"
import googleAuth from "../services/googleAuth.js"

const router= express.Router();

router.get("/google", (req,res) => {
    res.redirect(googleAuth.getAuthUrl());
});

router.get("/google/callback" , async(req,res) => {
    const {code} = req.query;

    const {tokens} = await googleAuth.oauth2Client.getToken(code);
    googleAuth.setCredentials(tokens);

    res.send("Google drive connected. Close this tab");
});

export default router;