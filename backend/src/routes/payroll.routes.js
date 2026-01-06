import express from "express";
import {
  createPayrollRun,
  reviewPayroll,
  approvePayrollRun,
  payPayroll,
  listPayrollRuns,
  getPayrollItems,
} from "../controllers/payroll.controller.js";

const router = express.Router();

router.post("/", createPayrollRun);
router.get("/", listPayrollRuns);
router.get("/:id/items", getPayrollItems);

router.post("/:id/review", reviewPayroll);
router.post("/:id/approve", approvePayrollRun);
router.post("/:id/pay", payPayroll);

export default router;
