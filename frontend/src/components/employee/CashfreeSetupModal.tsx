"use client";

import { useEffect, useState } from "react";
import { employeeApi } from "@/services/employee.api";
import BankAccountForm from "./BankAccountForm";
import { BankAccountFormData } from "@/types/employee";

interface CashfreeSetupModalProps {
    employeeId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function CashfreeSetupModal({ employeeId, isOpen, onClose }: CashfreeSetupModalProps) {
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<Partial<BankAccountFormData> | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && employeeId) {
            setLoading(true);
            employeeApi.getEmployee(employeeId)
                .then((data) => {
                    if (data.bankAccount) {
                        setInitialData({
                            employeeId: employeeId,
                            accountHolderName: data.bankAccount.accountHolderName,
                            accountNumber: data.bankAccount.accountNumber,
                            ifscCode: data.bankAccount.ifscCode,
                            bankName: data.bankAccount.bankName,
                        });
                    } else {
                        setInitialData(undefined);
                    }
                })
                .catch((err) => console.error("Failed to fetch employee details", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, employeeId]);

    const handleSubmit = async (data: Omit<BankAccountFormData, "employeeId">) => {
        setIsSubmitting(true);
        try {
            await employeeApi.startCashfreeOnboarding({
                employeeId,
                bankAccountData: data,
            });
            alert("Cashfree setup completed successfully!");
            onClose();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to setup Cashfree. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Setup Cashfree Beneficiary
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">Fetching employee details...</p>
                    </div>
                ) : (
                    <BankAccountForm
                        employeeId={employeeId}
                        onSubmit={handleSubmit}
                        onBack={onClose}
                        isSubmitting={isSubmitting}
                        initialData={initialData}
                    />
                )}
            </div>
        </div>
    );
}
