import PayrollRun from "../models/PayrollRun.model.js";

export async function approvePayroll(payrollRunId, approverId) {
  const payrollRun = await PayrollRun.findById(payrollRunId);

  if (!payrollRun) throw new Error("Payroll run not found");

  if (payrollRun.status !== "REVIEWED")
    throw new Error("Payroll must be reviewed before approval");

  payrollRun.status = "APPROVED";
  payrollRun.locked = true;
  payrollRun.approvedBy = approverId;
  payrollRun.approvedAt = new Date();

  await payrollRun.save();
  return payrollRun;
}
