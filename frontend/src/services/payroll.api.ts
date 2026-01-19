import api from "./api";
import {
    PayrollRun,
    PayrollItem,
    CreatePayrollRequest,
} from "@/types/payroll";

export const payrollApi = {
    // List all payroll runs
    listPayrollRuns: async (): Promise<PayrollRun[]> => {
        const response = await api.get("/api/payroll");
        return response.data;
    },

    // Create a new payroll run
    createPayrollRun: async (
        data: CreatePayrollRequest
    ): Promise<PayrollRun> => {
        const response = await api.post("/api/payroll", data);
        return response.data;
    },

    // Get payroll items (payslips) for a specific run
    getPayrollItems: async (payrollRunId: string): Promise<PayrollItem[]> => {
        const response = await api.get(`/api/payroll/${payrollRunId}/items`);
        return response.data;
    },

    // Mark payroll as reviewed
    reviewPayroll: async (payrollRunId: string): Promise<PayrollRun> => {
        const response = await api.post(`/api/payroll/${payrollRunId}/review`);
        return response.data;
    },

    // Approve payroll
    approvePayroll: async (payrollRunId: string): Promise<PayrollRun> => {
        const response = await api.post(`/api/payroll/${payrollRunId}/approve`);
        return response.data;
    },

    // Execute payments via Cashfree
    payPayroll: async (payrollRunId: string): Promise<any> => {
        const response = await api.post(`/api/payroll/${payrollRunId}/pay`);
        return response.data;
    },
};
