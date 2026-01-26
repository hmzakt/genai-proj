import express from "express";
import {
  createPayrollRun,
  reviewPayroll,
  approvePayrollRun,
  payPayroll,
  listPayrollRuns,
  getPayrollItems,
  retryPayroll,
} from "../controllers/payroll.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All payroll routes require authentication
router.use(authenticate);

router.post("/", createPayrollRun);
router.get("/", listPayrollRuns);
router.get("/:id/items", getPayrollItems);

router.post("/:id/review", reviewPayroll);
router.post("/:id/approve", approvePayrollRun);
router.post("/:id/pay", payPayroll);
router.post("/:id/retry", retryPayroll);

export default router;
