"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { employeeApi } from "@/services/employee.api";
import { format } from "date-fns";
import CashfreeSetupModal from "./CashfreeSetupModal";

export default function EmployeeList() {
    const router = useRouter();
    const [loadingCashfree, setLoadingCashfree] = useState<string | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    const { data: employees, isLoading, error } = useQuery({
        queryKey: ["employees"],
        queryFn: employeeApi.listEmployees,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading employees...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600 dark:text-red-400">
                    Error loading employees. Please try again.
                </div>
            </div>
        );
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700";
            case "ON_HOLD":
                return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700";
            case "EXITED":
                return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600";
            default:
                return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600";
        }
    };

    const handleCashfreeOnboarding = (employeeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEmployeeId(employeeId);
    };

    return (
        <>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 p-3 sm:p-4">
                {employees && employees.length > 0 ? (
                    employees.map((employee) => (
                        <div
                            key={employee._id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/employees/${employee._id}`)}
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Employee Code</div>
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            {employee.employeeCode}
                                        </div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {employee.name}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                            {employee.email}
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                                            employee.status
                                        )}`}
                                    >
                                        {employee.status}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Department</div>
                                        <div className="text-xs text-gray-900 dark:text-white">{employee.department || "-"}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Role</div>
                                        <div className="text-xs text-gray-900 dark:text-white">{employee.role || "-"}</div>
                                    </div>
                                </div>
                                
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Joining Date</div>
                                    <div className="text-xs text-gray-900 dark:text-white mb-3">
                                        {format(new Date(employee.dateOfJoining), "MMM dd, yyyy")}
                                    </div>
                                    <button
                                        onClick={(e) => handleCashfreeOnboarding(employee._id, e)}
                                        disabled={loadingCashfree === employee._id}
                                        className="w-full px-3 py-2 text-xs font-medium text-white bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingCashfree === employee._id ? "Loading..." : "Setup Cashfree"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                        No employees found. Start by onboarding your first employee.
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Employee Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Joining Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {employees && employees.length > 0 ? (
                            employees.map((employee) => (
                                <tr
                                    key={employee._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => router.push(`/employees/${employee._id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {employee.employeeCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {employee.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {employee.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {employee.department || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {employee.role || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {format(new Date(employee.dateOfJoining), "MMM dd, yyyy")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                                                employee.status
                                            )}`}
                                        >
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={(e) => handleCashfreeOnboarding(employee._id, e)}
                                            disabled={loadingCashfree === employee._id}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingCashfree === employee._id ? "Loading..." : "Setup Cashfree"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                                >
                                    No employees found. Start by onboarding your first employee.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedEmployeeId && (
                <CashfreeSetupModal
                    employeeId={selectedEmployeeId}
                    isOpen={!!selectedEmployeeId}
                    onClose={() => setSelectedEmployeeId(null)}
                />
            )}
        </>
    );
}
