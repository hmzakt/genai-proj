"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "@/services/employee.api";
import {
    PayrollProfileFormData,
    EmploymentType,
    PayFrequency,
} from "@/types/employee";

interface PayrollConfigFormProps {
    employeeId: string;
    onNext: (data: Omit<PayrollProfileFormData, "employeeId">) => void;
    onBack: () => void;
    initialData?: Partial<PayrollProfileFormData>;
}

export default function PayrollConfigForm({
    employeeId,
    onNext,
    onBack,
    initialData,
}: PayrollConfigFormProps) {
    const [formData, setFormData] = useState({
        employmentType: (initialData?.employmentType || "FULL_TIME") as EmploymentType,
        baseSalary: initialData?.baseSalary || 0,
        payFrequency: (initialData?.payFrequency || "MONTHLY") as PayFrequency,
        incentivePlanId: initialData?.incentivePlanId || "",
        effectiveFrom: initialData?.effectiveFrom || "",
    });

    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const { data: incentivePlans, isLoading } = useQuery({
        queryKey: ["incentivePlans"],
        queryFn: employeeApi.listIncentivePlans,
    });

    const validate = (): boolean => {
        const newErrors: Partial<Record<string, string>> = {};

        if (!formData.baseSalary || formData.baseSalary <= 0) {
            newErrors.baseSalary = "Base salary must be greater than 0";
        }
        if (!formData.effectiveFrom) {
            newErrors.effectiveFrom = "Effective from date is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // Sanitize incentivePlanId
            const submissionData = {
                ...formData,
                incentivePlanId: formData.incentivePlanId || undefined,
            };
            onNext(submissionData);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Employment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.employmentType}
                        onChange={(e) =>
                            handleChange("employmentType", e.target.value as EmploymentType)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="INTERN">Intern</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pay Frequency <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.payFrequency}
                        onChange={(e) =>
                            handleChange("payFrequency", e.target.value as PayFrequency)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="MONTHLY">Monthly</option>
                        <option value="DAILY">Daily</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Base Salary (INR) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={formData.baseSalary || ""}
                        onChange={(e) =>
                            handleChange("baseSalary", parseFloat(e.target.value) || 0)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ${errors.baseSalary ? "border-red-500 dark:border-red-500" : ""
                            }`}
                        placeholder="50000"
                        min="0"
                        step="1000"
                    />
                    {errors.baseSalary && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.baseSalary}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Effective From <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.effectiveFrom}
                        onChange={(e) => handleChange("effectiveFrom", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ${errors.effectiveFrom ? "border-red-500 dark:border-red-500" : ""
                            }`}
                    />
                    {errors.effectiveFrom && (
                        <p className="mt-1 text-sm text-red-600">{errors.effectiveFrom}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Incentive Plan (Optional)
                    </label>
                    <select
                        value={formData.incentivePlanId}
                        onChange={(e) => handleChange("incentivePlanId", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={isLoading}
                    >
                        <option value="">No Incentive Plan</option>
                        {incentivePlans?.map((plan) => (
                            <option key={plan._id} value={plan._id}>
                                {plan.name} ({plan.type})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-600 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-700"
                >
                    Next: Bank Account
                </button>
            </div>
        </form>
    );
}
