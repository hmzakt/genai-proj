import PayrollRun from "../models/paymentSystem/payrollRun.model.js";
import PayrollItem from "../models/paymentSystem/payrollItem.model.js";
import BankAccount from "../models/paymentSystem/bankAccount.model.js"
import PaymentLog from "../models/paymentSystem/paymentLog.model.js"
import CashfreeAdapter from "./cashfree.adapter.js";

const paymentAdapter = new CashfreeAdapter();

export async function executePayrollPayments(payrollRunId) {
    const payrollRun = await PayrollRun.findById(payrollRunId);

    if (!payrollRun) throw new Error("Payroll run not found");

    if (payrollRun.status !== "APPROVED" && payrollRun.status !== "PAID") {
        throw new Error("Payroll must be APPROVED or already processed to retry payments");
    }

    const payrollItems = await PayrollItem.find({
        payrollRunId
    }).populate("employeeId");

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (const item of payrollItems) {
        // Skip if already paid successfully
        const existingPayment = await PaymentLog.findOne({
            payrollItemId: item._id,
            status: "SUCCESS"
        });
        if (existingPayment) {
            skipCount++;
            continue;
        }

        try {
            // Find the employee's primary bank account (relax verified/onboarding checks
            // since the adapter will verify/re-create the beneficiary on Cashfree)
            const bankAccount = await BankAccount.findOne({
                employeeId: item.employeeId._id,
                isPrimary: true,
            });

            if (!bankAccount || !bankAccount.accountNumber || !bankAccount.ifscCode) {
                console.warn(`No valid bank account for employee ${item.employeeId?.email || item.employeeId._id}. Marking PENDING_ONBOARDING.`);
                await PaymentLog.create({
                    payrollItemId: item._id,
                    provider: "CASHFREE",
                    amount: item.netPay,
                    status: "PENDING_ONBOARDING",
                    rawResponse: { reason: "No bank account or Cashfree beneficiary linked" },
                });
                failCount++;
                continue;
            }

            console.log(`Processing payment for ${item.employeeId?.email || item.employeeId._id}, amount: ${item.netPay}`);

            const response = await paymentAdapter.transfer({
                amount: item.netPay,
                bankAccount,
                reference: item._id.toString(),
                employee: item.employeeId, // populated via .populate("employeeId")
            });

            await PaymentLog.create({
                payrollItemId: item._id,
                provider: "CASHFREE",
                transactionId: response.transactionId,
                amount: item.netPay,
                status: response.success ? "SUCCESS" : "FAILED",
                rawResponse: response.raw
            });

            if (response.success) successCount++;
            else failCount++;
        } catch (err) {
            console.error(`Payment failed for employee ${item.employeeId?.email || item.employeeId._id}:`, err.message);
            await PaymentLog.create({
                payrollItemId: item._id,
                provider: "CASHFREE",
                amount: item.netPay,
                status: "FAILED",
                rawResponse: { error: err.message }
            });
            failCount++;
        }
    }

    console.log(`Payroll ${payrollRunId} complete: ${successCount} success, ${failCount} failed, ${skipCount} skipped (already paid)`);
    payrollRun.status = "PAID";
    await payrollRun.save();

    return { success: true };
}


// trigger thorugh scheduled automation or maybe after approval we will think about this later