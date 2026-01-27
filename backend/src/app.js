import express from "express";
import cors from "cors";
import { authenticate } from "./middlewares/auth.middleware.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";

import candidateRoutes from "./routes/candidates.routes.js";
import batchRoutes from "./routes/batches.routes.js"
import googleAuthRoutes from "./routes/googleAuth.routes.js"
import payrollRoutes from "./routes/payroll.routes.js";
import employeeRoutes from "./routes/employee.routes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration for Vercel and local development
const getAllowedOrigins = () => {
  const origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];
  
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  return origins;
};

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

import connectDB from "./db.js";
connectDB();

//public routes
app.use("/company", companyRoutes);
app.use("/jobs", jobRoutes);

//private routes
app.use("/candidates", candidateRoutes);
app.use("/batches", batchRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/employees", employeeRoutes);

export default app;