import { runPayroll } from "../services/payrollEngine.service.js";
import { markPayrollReviewed } from "../services/payrollApproval.service.js";
import { approvePayroll } from "../services/payrollLock.service.js";
import { executePayrollPayments } from "../payments/paymentOrchestrator.service.js";
import PayrollRun from "../models/paymentSystem/payrollRun.model.js";
import PayrollItem from "../models/paymentSystem/payrollItem.model.js";


export async function createPayrollRun(req, res) {
    try {
        const { periodStart, periodEnd } = req.body;

        const payrollRun = await runPayroll({
            periodStart,
            periodEnd,
            createdBy: req.user.uid,
            companyId: req.user.companyId,
        });

        res.status(201).json(payrollRun);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


export async function reviewPayroll(req, res) {
    try {
        // Verify ownership
        const run = await PayrollRun.findById(req.params.id);
        if (!run) return res.status(404).json({ error: "Payroll run not found" });
        if (!run.companyId.equals(req.user.companyId)) return res.status(403).json({ error: "Access denied" });

        const payrollRun = await markPayrollReviewed(req.params.id, req.user.uid);
        res.json(payrollRun);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


export async function approvePayrollRun(req, res) {
    try {
        const run = await PayrollRun.findById(req.params.id);
        if (!run) return res.status(404).json({ error: "Payroll run not found" });
        if (!run.companyId.equals(req.user.companyId)) return res.status(403).json({ error: "Access denied" });

        const payrollRun = await approvePayroll(req.params.id, req.user.uid);
        res.json(payrollRun);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function payPayroll(req, res) {
    try {
        const run = await PayrollRun.findById(req.params.id);
        if (!run) return res.status(404).json({ error: "Payroll run not found" });
        if (!run.companyId.equals(req.user.companyId)) return res.status(403).json({ error: "Access denied" });

        const result = await executePayrollPayments(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function retryPayroll(req, res) {
    try {
        const run = await PayrollRun.findById(req.params.id);
        if (!run) return res.status(404).json({ error: "Payroll run not found" });
        if (!run.companyId.equals(req.user.companyId)) return res.status(403).json({ error: "Access denied" });

        const result = await executePayrollPayments(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


export async function listPayrollRuns(req, res) {
    try {
        const runs = await PayrollRun.find({ companyId: req.user.companyId }).sort({ createdAt: -1 });
        res.json(runs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getPayrollItems(req, res) {
    try {
        const PaymentLog = (await import("../models/paymentSystem/paymentLog.model.js")).default;

        const run = await PayrollRun.findById(req.params.id);
        if (!run) return res.status(404).json({ error: "Payroll run not found" });
        if (!run.companyId.equals(req.user.companyId)) return res.status(403).json({ error: "Access denied" });

        const items = await PayrollItem.find({
            payrollRunId: req.params.id,
        }).populate("employeeId");

        // Fetch payment status for each item
        const itemsWithPaymentStatus = await Promise.all(
            items.map(async (item) => {
                const paymentLog = await PaymentLog.findOne({
                    payrollItemId: item._id,
                }).sort({ createdAt: -1 });

                return {
                    ...item.toObject(),
                    paymentStatus: paymentLog ? paymentLog.status : null,
                };
            })
        );

        res.json(itemsWithPaymentStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}