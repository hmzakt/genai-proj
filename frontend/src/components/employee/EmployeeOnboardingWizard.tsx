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
        createBankAccountMutation.mutate({
            ...data,
            employeeId,
        });
    };

    const handleStripeOnboarding = async () => {
        try {
            const result = await employeeApi.startStripeOnboarding({
                employeeId,
                returnUrl: `${window.location.origin}/employees`,
            });
            // Open Stripe onboarding in new tab
            window.open(result.onboardingUrl, "_blank");
        } catch (error: any) {
            alert(error.response?.data?.error || "Failed to start Stripe onboarding");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <StepIndicator currentStep={currentStep} steps={steps} />

            <div className="bg-white rounded-lg shadow p-8">
                {currentStep === 1 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Employee Information
                        </h2>
                        <EmployeeInfoForm
                            onNext={handleEmployeeInfoSubmit}
                            initialData={employeeData || undefined}
                        />
                        {createEmployeeMutation.isError && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                {(createEmployeeMutation.error as any)?.response?.data?.error ||
                                    "Failed to create employee"}
                            </div>
                        )}
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Payroll Configuration
                        </h2>
                        <PayrollConfigForm
                            employeeId={employeeId}
                            onNext={handlePayrollConfigSubmit}
                            onBack={() => setCurrentStep(1)}
                            initialData={payrollData || undefined}
                        />
                        {createPayrollProfileMutation.isError && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                {(createPayrollProfileMutation.error as any)?.response?.data
                                    ?.error || "Failed to create payroll profile"}
                            </div>
                        )}
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Bank Account & Payment Setup
                        </h2>
                        <BankAccountForm
                            employeeId={employeeId}
                            onSubmit={handleBankAccountSubmit}
                            onBack={() => setCurrentStep(2)}
                            onStartStripeOnboarding={handleStripeOnboarding}
                            isSubmitting={createBankAccountMutation.isPending}
                        />
                        {createBankAccountMutation.isError && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
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
