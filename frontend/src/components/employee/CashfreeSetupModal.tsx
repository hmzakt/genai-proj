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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Setup Cashfree Beneficiary</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">Loading...</div>
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
