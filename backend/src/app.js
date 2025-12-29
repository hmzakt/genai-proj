import express from "express";
import cors from "cors";
import { authenticate } from "./middlewares/auth.middleware.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";

import candidateRoutes from "./routes/candidates.routes.js";
import batchRoutes from "./routes/batches.routes.js"
import googleAuthRoutes from "./routes/googleAuth.routes.js"


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import connectDB from "./db.js";
connectDB();

//public routes
app.use("/company", companyRoutes);
app.use("/jobs", jobRoutes);

//private routes
app.use("/candidates", candidateRoutes);
app.use("/batches", batchRoutes);
app.use("/auht", googleAuthRoutes);

export default app;