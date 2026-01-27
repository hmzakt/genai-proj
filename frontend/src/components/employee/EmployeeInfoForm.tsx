"use client";

import { useState } from "react";
import { EmployeeFormData } from "@/types/employee";

interface EmployeeInfoFormProps {
    onNext: (data: EmployeeFormData) => void;
    initialData?: Partial<EmployeeFormData>;
}

export default function EmployeeInfoForm({
    onNext,
    initialData,
}: EmployeeInfoFormProps) {
    const [formData, setFormData] = useState<EmployeeFormData>({
        employeeCode: initialData?.employeeCode || "",
        name: initialData?.name || "",
        email: initialData?.email || "",
        department: initialData?.department || "",
        role: initialData?.role || "",
        dateOfJoining: initialData?.dateOfJoining || "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

        if (!formData.employeeCode.trim()) {
            newErrors.employeeCode = "Employee code is required";
        }
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.dateOfJoining) {
            newErrors.dateOfJoining = "Date of joining is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext(formData);
        }
    };

    const handleChange = (field: keyof EmployeeFormData, value: string) => {
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
                        Employee Code <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.employeeCode}
                        onChange={(e) => handleChange("employeeCode", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ${errors.employeeCode ? "border-red-500 dark:border-red-500" : ""
                            }`}
                        placeholder="e.g., EMP001"
                    />
                    {errors.employeeCode && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employeeCode}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ${errors.name ? "border-red-500 dark:border-red-500" : ""
                            }`}
                        placeholder="John Doe"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 ${errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="john@example.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Department
                    </label>
                    <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleChange("department", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Engineering"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role/Position
                    </label>
                    <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Software Engineer"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date of Joining <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={(e) => handleChange("dateOfJoining", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 ${errors.dateOfJoining ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.dateOfJoining && (
                        <p className="mt-1 text-sm text-red-600">{errors.dateOfJoining}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-600 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-700"
                >
                    Next: Payroll Configuration
                </button>
            </div>
        </form>
    );
}
