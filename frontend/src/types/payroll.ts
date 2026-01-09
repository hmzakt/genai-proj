export type PayrollStatus = "DRAFT" | "REVIEWED" | "APPROVED" | "PAID";
export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface PayrollRun {
    _id: string;
    periodStart: string;
    periodEnd: string;
    status: PayrollStatus;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: string;
    locked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Employee {
    _id: string;
    name: string;
    email: string;
}

export interface PayrollItem {
    _id: string;
    payrollRunId: string;
    employeeId: Employee;
    baseSalary: number;
    incentive: number;
    bonus: number;
    deductions: number;
    tax: number;
    grossPay: number;
    netPay: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    paymentStatus?: PaymentStatus;
}

export interface PaymentLog {
    _id: string;
    payrollItemId: string;
    provider: string;
    transactionId?: string;
    amount: number;
    status: PaymentStatus;
    initiatedAt: string;
    rawResponse?: any;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePayrollRequest {
    periodStart: string;
    periodEnd: string;
}
