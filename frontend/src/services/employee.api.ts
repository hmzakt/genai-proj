import api from "./api";
import {
    Employee,
    EmployeeWithDetails,
    EmployeeFormData,
    PayrollProfileFormData,
    BankAccountFormData,
    IncentivePlan,
    StripeOnboardingRequest,
    StripeOnboardingResponse,
    PayrollProfile,
    BankAccount,
} from "@/types/employee";

export const employeeApi = {
    // List all employees
    listEmployees: async (): Promise<Employee[]> => {
        const response = await api.get("/api/employees");
        return response.data;
    },

    // Get employee with details
    getEmployee: async (employeeId: string): Promise<EmployeeWithDetails> => {
        const response = await api.get(`/api/employees/${employeeId}`);
        return response.data;
    },

    // Create employee (Step 1)
    createEmployee: async (data: EmployeeFormData): Promise<Employee> => {
        const response = await api.post("/api/employees", data);
        return response.data;
    },

    // Update employee
    updateEmployee: async (
        employeeId: string,
        data: Partial<EmployeeFormData>
    ): Promise<Employee> => {
        const response = await api.put(`/api/employees/${employeeId}`, data);
        return response.data;
    },

    // Create payroll profile (Step 2)
    createPayrollProfile: async (
        data: PayrollProfileFormData
    ): Promise<PayrollProfile> => {
        const response = await api.post("/api/employees/payroll-profiles", data);
        return response.data;
    },

    // Create bank account (Step 3)
    createBankAccount: async (
        data: BankAccountFormData
    ): Promise<BankAccount> => {
        const response = await api.post("/api/employees/bank-accounts", data);
        return response.data;
    },

    // Start Stripe onboarding
    startStripeOnboarding: async (
        data: StripeOnboardingRequest
    ): Promise<StripeOnboardingResponse> => {
        const response = await api.post("/api/employees/stripe/onboard", data);
        return response.data;
    },

    // List incentive plans
    listIncentivePlans: async (): Promise<IncentivePlan[]> => {
        const response = await api.get("/api/employees/incentive-plans/list");
        return response.data;
    },
};
