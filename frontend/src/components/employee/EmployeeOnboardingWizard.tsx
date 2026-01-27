"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { employeeApi } from "@/services/employee.api";
import StepIndicator from "./StepIndicator";
import EmployeeInfoForm from "./EmployeeInfoForm";
import PayrollConfigForm from "./PayrollConfigForm";
import BankAccountForm from "./BankAccountForm";
import {
    EmployeeFormData,
    PayrollProfileFormData,
    BankAccountFormData,
} from "@/types/employee";

export default function EmployeeOnboardingWizard() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [currentStep, setCurrentStep] = useState(1);
    const [employeeId, setEmployeeId] = useState<string>("");
    const [employeeData, setEmployeeData] = useState<EmployeeFormData | null>(
        null
    );
    const [payrollData, setPayrollData] = useState<
        Omit<PayrollProfileFormData, "employeeId"> | null
    >(null);

    const steps = ["Employee Info", "Payroll Config", "Bank Account"];

    const createEmployeeMutation = useMutation({
        mutationFn: employeeApi.createEmployee,
        onSuccess: (data) => {
            setEmployeeId(data._id);
            setCurrentStep(2);
        },
    });

    const createPayrollProfileMutation = useMutation({
        mutationFn: employeeApi.createPayrollProfile,
        onSuccess: () => {
            setCurrentStep(3);
        },
    });

    const createBankAccountMutation = useMutation({
        mutationFn: employeeApi.createBankAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            // Show success and redirect
            alert("Employee onboarded successfully!");
            router.push("/employees");
        },
    });

    const handleEmployeeInfoSubmit = (data: EmployeeFormData) => {
        setEmployeeData(data);
        createEmployeeMutation.mutate(data);
    };

    const handlePayrollConfigSubmit = (
        data: Omit<PayrollProfileFormData, "employeeId">
    ) => {
        setPayrollData(data);
        createPayrollProfileMutation.mutate({
            ...data,
            employeeId,
        });
    };

    const handleBankAccountSubmit = (
        data: Omit<BankAccountFormData, "employeeId">
    ) => {
        // Directly call Cashfree onboarding with bank account data
        handleCashfreeOnboarding(data);
    };

    const handleCashfreeOnboarding = async (bankAccountData: any) => {
        try {
            const result = await employeeApi.startCashfreeOnboarding({
                employeeId,
                bankAccountData,
            });
            alert("Cashfree beneficiary created successfully!");
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            router.push("/employees");
        } catch (error: any) {
            alert(error.response?.data?.error || "Failed to create Cashfree beneficiary");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <StepIndicator currentStep={currentStep} steps={steps} />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
                {currentStep === 1 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Employee Information
                        </h2>
                        <EmployeeInfoForm
                            onNext={handleEmployeeInfoSubmit}
                            initialData={employeeData || undefined}
                        />
                        {createEmployeeMutation.isError && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm border border-red-200 dark:border-red-800">
                                {(createEmployeeMutation.error as any)?.response?.data?.error ||
                                    "Failed to create employee"}
                            </div>
                        )}
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Payroll Configuration
                        </h2>
                        <PayrollConfigForm
                            employeeId={employeeId}
                            onNext={handlePayrollConfigSubmit}
                            onBack={() => setCurrentStep(1)}
                            initialData={payrollData || undefined}
                        />
                        {createPayrollProfileMutation.isError && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm border border-red-200 dark:border-red-800">
                                {(createPayrollProfileMutation.error as any)?.response?.data
                                    ?.error || "Failed to create payroll profile"}
                            </div>
                        )}
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Bank Account & Payment Setup
                        </h2>
                        <BankAccountForm
                            employeeId={employeeId}
                            onSubmit={handleBankAccountSubmit}
                            onBack={() => setCurrentStep(2)}
                            isSubmitting={false}
                        />
                        {createBankAccountMutation.isError && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm border border-red-200 dark:border-red-800">
                                {(createBankAccountMutation.error as any)?.response?.data
                                    ?.error || "Failed to create bank account"}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
