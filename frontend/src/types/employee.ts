export type EmploymentType = "FULL_TIME" | "CONTRACT" | "INTERN";
export type PayFrequency = "MONTHLY" | "DAILY";
export type EmployeeStatus = "ACTIVE" | "ON_HOLD" | "EXITED";
export type IncentivePlanType = "PERFORMANCE" | "SALES" | "ATTENDANCE" | "CUSTOM";
export type PayoutType = "FIXED" | "PERCENTAGE";

export interface Employee {
    _id: string;
    employeeCode: string;
    name: string;
    email: string;
    department?: string;
    role?: string;
    dateOfJoining: string;
    status: EmployeeStatus;
    createdAt: string;
    updatedAt: string;
}

export interface PayrollProfile {
    _id: string;
    employeeId: string;
    employmentType: EmploymentType;
    baseSalary: number;
    payFrequency: PayFrequency;
    currency: string;
    incentivePlanId?: string;
    effectiveFrom: string;
    effectiveTo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BankAccount {
    _id: string;
    employeeId: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName?: string;
    isPrimary: boolean;
    verified: boolean;
    cashfreeBeneficiaryId?: string;
    onboardingStatus?: "PENDING" | "COMPLETE";
    createdAt: string;
    updatedAt: string;
}

export interface IncentivePlan {
    _id: string;
    name: string;
    type: IncentivePlanType;
    rules: Array<{
        metric: string;
        condition: string;
        value: number;
    }>;
    payoutType: PayoutType;
    capAmount?: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeWithDetails {
    employee: Employee;
    payrollProfile?: PayrollProfile;
    bankAccount?: BankAccount;
}

// Form data interfaces
export interface EmployeeFormData {
    employeeCode: string;
    name: string;
    email: string;
    department?: string;
    role?: string;
    dateOfJoining: string;
}

export interface PayrollProfileFormData {
    employeeId: string;
    employmentType: EmploymentType;
    baseSalary: number;
    payFrequency: PayFrequency;
    incentivePlanId?: string;
    effectiveFrom: string;
}

export interface BankAccountFormData {
    employeeId: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName?: string;
}

export interface CashfreeOnboardingRequest {
    employeeId: string;
    bankAccountData: {
        accountHolderName: string;
        accountNumber: string;
        ifscCode: string;
        bankName?: string;
    };
}

export interface CashfreeOnboardingResponse {
    cashfreeBeneficiaryId: string;
    bankAccountId: string;
    success: boolean;
}
