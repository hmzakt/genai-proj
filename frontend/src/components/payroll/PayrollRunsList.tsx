"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { payrollApi } from "@/services/payroll.api";
import { PayrollRun } from "@/types/payroll";
import StatusBadge from "./StatusBadge";
import ConfirmDialog from "./ConfirmDialog";
import { format } from "date-fns";

export default function PayrollRunsList() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        action: "review" | "approve" | "pay" | null;
        payrollId: string | null;
    }>({
        isOpen: false,
        action: null,
        payrollId: null,
    });

    const { data: payrollRuns, isLoading, error } = useQuery({
        queryKey: ["payrollRuns"],
        queryFn: payrollApi.listPayrollRuns,
    });

    const reviewMutation = useMutation({
        mutationFn: payrollApi.reviewPayroll,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
            closeDialog();
        },
    });

    const approveMutation = useMutation({
        mutationFn: payrollApi.approvePayroll,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
            closeDialog();
        },
    });

    const payMutation = useMutation({
        mutationFn: payrollApi.payPayroll,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
            closeDialog();
        },
    });

    const handleAction = (
        action: "review" | "approve" | "pay",
        payrollId: string
    ) => {
        setConfirmDialog({ isOpen: true, action, payrollId });
    };

    const closeDialog = () => {
        setConfirmDialog({ isOpen: false, action: null, payrollId: null });
    };

    const confirmAction = () => {
        if (!confirmDialog.payrollId) return;

        switch (confirmDialog.action) {
            case "review":
                reviewMutation.mutate(confirmDialog.payrollId);
                break;
            case "approve":
                approveMutation.mutate(confirmDialog.payrollId);
                break;
            case "pay":
                payMutation.mutate(confirmDialog.payrollId);
                break;
        }
    };

    const getActionButton = (payroll: PayrollRun, isMobile: boolean = false) => {
        const baseClasses = isMobile
            ? "w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
            : "px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95";

        switch (payroll.status) {
            case "DRAFT":
                return (
                    <button
                        onClick={() => handleAction("review", payroll._id)}
                        className={`${baseClasses} text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700`}
                    >
                        Review
                    </button>
                );
            case "REVIEWED":
                return (
                    <button
                        onClick={() => handleAction("approve", payroll._id)}
                        className={`${baseClasses} text-white bg-purple-600 dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-700`}
                    >
                        Approve
                    </button>
                );
            case "APPROVED":
                return (
                    <button
                        onClick={() => handleAction("pay", payroll._id)}
                        className={`${baseClasses} text-white bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700`}
                    >
                        Pay
                    </button>
                );
            case "PAID":
                return (
                    <button
                        onClick={() => router.push(`/payroll/${payroll._id}/items`)}
                        className={`${baseClasses} text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50`}
                    >
                        View Payslips
                    </button>
                );
        }
    };

    const getDialogContent = () => {
        switch (confirmDialog.action) {
            case "review":
                return {
                    title: "Mark as Reviewed",
                    message:
                        "Are you sure you want to mark this payroll run as reviewed?",
                    confirmText: "Mark Reviewed",
                };
            case "approve":
                return {
                    title: "Approve Payroll",
                    message:
                        "Are you sure you want to approve this payroll run? This will lock the payroll and prevent further changes.",
                    confirmText: "Approve",
                };
            case "pay":
                return {
                    title: "Execute Payments",
                    message:
                        "Are you sure you want to execute Cashfree payments for this payroll run? This action cannot be undone.",
                    confirmText: "Execute Payments",
                };
            default:
                return {
                    title: "",
                    message: "",
                    confirmText: "Confirm",
                };
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading payroll runs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600 dark:text-red-400">
                    Error loading payroll runs. Please try again.
                </div>
            </div>
        );
    }

    const dialogContent = getDialogContent();

    return (
        <>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 p-3 sm:p-4">
                {payrollRuns && payrollRuns.length > 0 ? (
                    payrollRuns.map((payroll) => (
                        <div key={payroll._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Period</div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {format(new Date(payroll.periodStart), "MMM dd, yyyy")} -{" "}
                                        {format(new Date(payroll.periodEnd), "MMM dd, yyyy")}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
                                        <StatusBadge status={payroll.status} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-300">
                                            {format(new Date(payroll.createdAt), "MMM dd, yyyy")}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                    {getActionButton(payroll, true)}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                        No payroll runs found. Create your first payroll run to get started.
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Period
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {payrollRuns && payrollRuns.length > 0 ? (
                            payrollRuns.map((payroll) => (
                                <tr key={payroll._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {format(new Date(payroll.periodStart), "MMM dd, yyyy")} -{" "}
                                        {format(new Date(payroll.periodEnd), "MMM dd, yyyy")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={payroll.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {format(new Date(payroll.createdAt), "MMM dd, yyyy")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {getActionButton(payroll)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                                >
                                    No payroll runs found. Create your first payroll run to get
                                    started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={dialogContent.title}
                message={dialogContent.message}
                confirmText={dialogContent.confirmText}
                onConfirm={confirmAction}
                onCancel={closeDialog}
                isLoading={
                    reviewMutation.isPending ||
                    approveMutation.isPending ||
                    payMutation.isPending
                }
            />
        </>
    );
}
