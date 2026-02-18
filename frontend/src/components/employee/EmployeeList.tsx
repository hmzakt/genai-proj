"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { employeeApi } from "@/services/employee.api";
import { format } from "date-fns";
import CashfreeSetupModal from "./CashfreeSetupModal";
import ConfirmDialog from "@/components/payroll/ConfirmDialog";

export default function EmployeeList() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [loadingCashfree, setLoadingCashfree] = useState<string | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDept, setFilterDept] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; employeeId: string | null }>({
        isOpen: false,
        employeeId: null,
    });

    const { data: employees, isLoading, error } = useQuery({
        queryKey: ["employees"],
        queryFn: employeeApi.listEmployees,
    });

    const deleteMutation = useMutation({
        mutationFn: employeeApi.deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            setDeleteConfirm({ isOpen: false, employeeId: null });
        },
        onError: (err: any) => {
            alert(err.response?.data?.error || "Failed to delete employee");
        }
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


    const employeesData = employees || [];

    // Derived filtering logic
    const filteredEmployees = employeesData.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = filterDept ? emp.department === filterDept : true;
        const matchesRole = filterRole ? emp.role === filterRole : true;
        return matchesSearch && matchesDept && matchesRole;
    });

    // Unique departments and roles for filters
    const departments = Array.from(new Set(employeesData.map(e => e.department).filter(Boolean)));
    const roles = Array.from(new Set(employeesData.map(e => e.role).filter(Boolean)));

    const handleCashfreeOnboarding = (employeeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEmployeeId(employeeId);
    };

    const handleDeleteClick = (employeeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteConfirm({ isOpen: true, employeeId });
    };

    const confirmDelete = () => {
        if (deleteConfirm.employeeId) {
            deleteMutation.mutate(deleteConfirm.employeeId);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    />
                </div>

                <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>

                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                >
                    <option value="">All Roles</option>
                    {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>

                <button
                    onClick={() => { setSearchQuery(""); setFilterDept(""); setFilterRole(""); }}
                    className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                    Clear Filters
                </button>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 p-3 sm:p-4">
                {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                        <div
                            key={employee._id}
                            className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                            onClick={() => router.push(`/employees/${employee._id}`)}
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">{employee.employeeCode}</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                            {employee.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {employee.email}
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(
                                            employee.status
                                        )}`}
                                    >
                                        {employee.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100 dark:border-gray-700">
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Department</div>
                                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{employee.department || "-"}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Role</div>
                                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{employee.role || "-"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <button
                                        onClick={(e) => handleCashfreeOnboarding(employee._id, e)}
                                        className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm"
                                    >
                                        Setup Cashfree
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteClick(employee._id, e)}
                                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-xl transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
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
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                Employee
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                Details
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee) => (
                                <tr
                                    key={employee._id}
                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors group"
                                    onClick={() => router.push(`/employees/${employee._id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mr-3 shadow-sm">
                                                {employee.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {employee.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {employee.employeeCode}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                                            {employee.role || "-"}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {employee.department || "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(
                                                employee.status
                                            )}`}
                                        >
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleCashfreeOnboarding(employee._id, e)}
                                                className="px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                            >
                                                Cashfree
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteClick(employee._id, e)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                title="Delete Employee"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
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
                    employeeId={selectedEmployeeId as string}
                    isOpen={!!selectedEmployeeId}
                    onClose={() => setSelectedEmployeeId(null)}
                />
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Employee"
                message="Are you sure you want to delete this employee? This will also remove their payroll profile and bank account details. This action cannot be undone."
                confirmText="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, employeeId: null })}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
