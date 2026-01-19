import PayrollRun from "../models/paymentSystem/payrollRun.model.js";
import PayrollItem from "../models/paymentSystem/payrollItem.model.js";
import BankAccount from "../models/paymentSystem/bankAccount.model.js"
import PaymentLog from "../models/paymentSystem/paymentLog.model.js"
import CashfreeAdapter from "./cashfree.adapter.js";

const paymentAdapter = new CashfreeAdapter();

export async function executePayrollPayments(payrollRunId) {
    const payrollRun = await PayrollRun.findById(payrollRunId);

    if (!payrollRun) throw new Error("Payroll run not found");

    if (payrollRun.status !== "APPROVED") {
        throw new Error("payroll must be APPROVED before payment");
    }

    const payrollItems = await PayrollItem.find({
        payrollRunId
    }).populate("employeeId");

    for (const item of payrollItems) {
        try {
            const bankAccount = await BankAccount.findOne({
                employeeId: item.employeeId._id,
                isPrimary: true,
                verified: true
            });

            if (
                !bankAccount ||
                bankAccount.onboardingStatus !== "COMPLETE"
            ) {
                await PaymentLog.create({
                    payrollItemId: item._id,
                    provider: "CASHFREE",
                    amount: item.netPay,
                    status: "PENDING_ONBOARDING",
                    rawResponse: { reason: "Cashfree onboarding incomplete" },
                });
                continue;
            }

            const response = await paymentAdapter.transfer({
                amount: item.netPay,
                bankAccount,
                reference: item._id.toString()
            });

            await PaymentLog.create({
                payrollItemId: item._id,
                provider: "CASHFREE",
                transactionId: response.transactionId,
                amount: item.netPay,
                status: response.success ? "SUCCESS" : "FAILED",
                rawResponse: response.raw
            });
        } catch (err) {
            await PaymentLog.create({
                payrollItemId: item._id,
                provider: "CASHFREE",
                amount: item.netPay,
                status: "FAILED",
                rawResponse: { error: err.message }
            });
        }
    }
    payrollRun.status = "PAID";
    await payrollRun.save();

    return { success: true };
}


// trigger thorugh scheduled automation or maybe after approval we will think about this later