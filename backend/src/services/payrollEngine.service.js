// read data -> active employees, their payroll profiles, payroll metrics, their incentive rules, tax
// calculate numbers
// produce payroll output

import Employee from "../models/paymentSystem/employee.model.js";
import PayrollProfile from "../models/paymentSystem/payrollProfile.model.js";
import PayrollRun from "../models/paymentSystem/payrollRun.model.js";
import PayrollMetrics from "../models/paymentSystem/payrollMetrics.model.js";
import PayrollItem from "../models/paymentSystem/payrollItem.model.js";
import IncentivePlan from "../models/paymentSystem/incentivePlan.model.js";



function evaluateRule(metricValue, condition, ruleValue) {
    switch (condition) {
        case ">=":
            return metricValue >= ruleValue;
        case "<=":
            return metricValue <= ruleValue;
        case ">":
            return metricValue > ruleValue;
        case "<":
            return metricValue < ruleValue;
        case "==":
            return metricValue == ruleValue;
        default:
            return false;
    }
}

function calculateIncentive(metrics, incentivePlan, baseSalary) {
    if (!incentivePlan || !incentivePlan.active) return 0;

    let eligible = true;

    for (const rule of incentivePlan.rules) {
        const metricValue = metrics?.[rule.metric] ?? 0;

        if (!evaluateRule(metricValue, rule.condition, rule.value)) {
            eligible = false;
            break;
        }
    }

    if (!eligible) return 0;

    let incentiveAmount = 0;

    if (incentivePlan.payoutType === "FIXED") {
        incentiveAmount = incentivePlan.capAmount || 0;
    } else if (incentivePlan.payoutType === "PERCENTAGE") {
        incentiveAmount = (baseSalary * (incentivePlan.capAmount || 0)) / 100;
    }
    return incentiveAmount;
}


// tax wala function

function calculateTax(grossPay) {
    if (grossPay <= 50000) return grossPay * 0.05;
    if (grossPay <= 100000) return grossPay * 0.01;
    return grossPay * 0.2;
}


export async function runPayroll({ periodStart, periodEnd, createdBy }) {
    
    const existingRun = await PayrollRun.findOne({
        periodStart,
        periodEnd,
        locked: true,
    });

    if (existingRun) {
        throw new Error("Payroll for this period is already locked");
    }

    const payrollRun = await PayrollRun.create({
        periodStart,
        periodEnd,
        createdBy,
        status: "DRAFT",
        locked: false
    });

    const employees = await Employee.find({ status: "ACTIVE" });

    for (const employee of employees) {
        const profile = await PayrollProfile.findOne({
            employeeId: employee._id,
            effectiveFrom: { $lte: periodEnd },
            $or: [{ effectiveTo: null }, { effectiveTo: { $gte: periodStart } }],
        });

        if (!profile) continue;

        const metrics = await PayrollMetrics.findOne({
            employeeId: employee._id,
            periodStart,
            periodEnd
        });

        let incentiveAmount = 0;
        if (profile.incentivePlanId) {
            const incentivePlan = await IncentivePlan.findById(
                profile.incentivePlanId
            );

            incentiveAmount = calculateIncentive(metrics, incentivePlan, profile.baseSalary); // *handle this function
        };

        const manualBonus = metrics?.manualBonus || 0;
        const deductions = metrics?.deductions || 0;

        const grossPay = profile.baseSalary + incentiveAmount + manualBonus - deductions;

        const tax = calculateTax(grossPay);  // TODO : handle this function

        const netPay = grossPay - tax;

        await PayrollItem.create({
            payrollRunId: payrollRun._id,
            employeeId: employee._id,
            baseSalary: profile.baseSalary,
            incentive: incentiveAmount,
            bonus: manualBonus,
            deductions,
            tax,
            grossPay,
            netPay,
            currency: profile.currency
        });
    }
    return payrollRun;
}