import { createEmployee } from "../services/emploee.service.js";
import { createPayrollProfile } from "../services/payrollProfile.service.js";
import { startCashfreeOnboarding } from "../services/cashfreeOnboarding.service.js";
import Employee from "../models/paymentSystem/employee.model.js";
import PayrollProfile from "../models/paymentSystem/payrollProfile.model.js";
import BankAccount from "../models/paymentSystem/bankAccount.model.js";
import IncentivePlan from "../models/paymentSystem/incentivePlan.model.js";

// List all employees
export async function listEmployees(req, res) {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get single employee with related data
export async function getEmployee(req, res) {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const payrollProfile = await PayrollProfile.findOne({
            employeeId: req.params.id,
        }).populate("incentivePlanId");

        const bankAccount = await BankAccount.findOne({
            employeeId: req.params.id,
        });

        res.json({
            employee,
            payrollProfile,
            bankAccount,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Create new employee (Step 1)
export async function createEmployeeController(req, res) {
    try {
        const employee = await createEmployee(req.body);
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Update employee
export async function updateEmployee(req, res) {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Create payroll profile (Step 2)
export async function createPayrollProfileController(req, res) {
    try {
        const payrollProfile = await createPayrollProfile(req.body);
        res.status(201).json(payrollProfile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Create bank account (Step 3)
export async function createBankAccountController(req, res) {
    try {
        const bankAccount = await BankAccount.create(req.body);
        res.status(201).json(bankAccount);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Start Cashfree onboarding
export async function startCashfreeOnboardingController(req, res) {
    try {
        const { employeeId, bankAccountData } = req.body;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const result = await startCashfreeOnboarding(employee, bankAccountData);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// List all incentive plans
export async function listIncentivePlans(req, res) {
    try {
        const plans = await IncentivePlan.find({ active: true });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
