import express from "express";
import { sendContactEmail } from "../controllers/contact.controller.js";

const router = express.Router();

// Public route — no auth required
router.post("/", sendContactEmail);

export default router;
