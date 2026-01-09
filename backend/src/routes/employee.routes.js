import express from "express";
import {
    listEmployees,
    getEmployee,
    createEmployeeController,
    updateEmployee,
    createPayrollProfileController,
    createBankAccountController,
    startStripeOnboardingController,
    listIncentivePlans,
} from "../controllers/employee.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All employee routes require authentication
router.use(authenticate);

// Employee routes
router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", createEmployeeController);
router.put("/:id", updateEmployee);

// Payroll profile routes
router.post("/payroll-profiles", createPayrollProfileController);

// Bank account routes
router.post("/bank-accounts", createBankAccountController);

// Stripe onboarding
router.post("/stripe/onboard", startStripeOnboardingController);

// Incentive plans
router.get("/incentive-plans/list", listIncentivePlans);

export default router;
