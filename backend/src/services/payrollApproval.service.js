import PayrollRun from "../models/PayrollRun.model.js";

export async function markPayrollReviewed(payrollRunId, reviewerId) {
  const payrollRun = await PayrollRun.findById(payrollRunId);

  if (!payrollRun) throw new Error("Payroll run not found");
  if (payrollRun.status !== "DRAFT")
    throw new Error("Only DRAFT payroll can be reviewed");

  payrollRun.status = "REVIEWED";
  payrollRun.approvedBy = reviewerId;

  await payrollRun.save();
  return payrollRun;
}
