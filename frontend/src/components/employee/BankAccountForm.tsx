"use client";

import { useState } from "react";
import { BankAccountFormData } from "@/types/employee";

interface BankAccountFormProps {
    employeeId: string;
    onSubmit: (data: Omit<BankAccountFormData, "employeeId">) => void;
    onBack: () => void;
    onStartStripeOnboarding?: () => void;
    isSubmitting?: boolean;
    initialData?: Partial<BankAccountFormData>;
}

export default function BankAccountForm({
    employeeId,
    onSubmit,
    onBack,
    onStartStripeOnboarding,
    isSubmitting = false,
    initialData,
}: BankAccountFormProps) {
    const [formData, setFormData] = useState({
        accountHolderName: initialData?.accountHolderName || "",
        accountNumber: initialData?.accountNumber || "",
        ifscCode: initialData?.ifscCode || "",
        bankName: initialData?.bankName || "",
    });

    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const validate = (): boolean => {
        const newErrors: Partial<Record<string, string>> = {};

        if (!formData.accountHolderName.trim()) {
            newErrors.accountHolderName = "Account holder name is required";
        }
        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = "Account number is required";
        } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
            newErrors.accountNumber = "Invalid account number (9-18 digits)";
        }
        if (!formData.ifscCode.trim()) {
            newErrors.ifscCode = "IFSC code is required";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
            newErrors.ifscCode = "Invalid IFSC code format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.accountHolderName}
                        onChange={(e) => handleChange("accountHolderName", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 ${errors.accountHolderName ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="John Doe"
                        disabled={isSubmitting}
                    />
                    {errors.accountHolderName && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.accountHolderName}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => handleChange("accountNumber", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 ${errors.accountNumber ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="1234567890"
                        disabled={isSubmitting}
                    />
                    {errors.accountNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.ifscCode}
                        onChange={(e) =>
                            handleChange("ifscCode", e.target.value.toUpperCase())
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 ${errors.ifscCode ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="SBIN0001234"
                        disabled={isSubmitting}
                    />
                    {errors.ifscCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name (Optional)
                    </label>
                    <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => handleChange("bankName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                        placeholder="State Bank of India"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            {onStartStripeOnboarding && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Stripe Payment Setup (Optional)
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                        Connect this employee to Stripe for automated salary payments.
                    </p>
                    <button
                        type="button"
                        onClick={onStartStripeOnboarding}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        disabled={isSubmitting}
                    >
                        Start Stripe Onboarding
                    </button>
                </div>
            )}

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={isSubmitting}
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Completing..." : "Complete Onboarding"}
                </button>
            </div>
        </form>
    );
}
