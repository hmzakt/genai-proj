import PayrollProfile from "../models/paymentSystem/payrollProfile.model.js";

export async function createPayrollProfile(data) {
  return PayrollProfile.create({
    employeeId: data.employeeId,
    employmentType: data.employmentType,
    baseSalary: data.baseSalary,
    payFrequency: data.payFrequency,
    incentivePlanId: data.incentivePlanId,
    effectiveFrom: data.effectiveFrom,
  });
}
