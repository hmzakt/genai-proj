"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payrollApi } from "@/services/payroll.api";

interface CreatePayrollModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePayrollModal({
    isOpen,
    onClose,
}: CreatePayrollModalProps) {
    const [periodStart, setPeriodStart] = useState("");
    const [periodEnd, setPeriodEnd] = useState("");
    const [error, setError] = useState("");

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: payrollApi.createPayrollRun,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payrollRuns"] });
            setPeriodStart("");
            setPeriodEnd("");
            setError("");
            onClose();
        },
        onError: (err: any) => {
            setError(err.response?.data?.error || "Failed to create payroll run");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!periodStart || !periodEnd) {
            setError("Both dates are required");
            return;
        }

        if (new Date(periodStart) >= new Date(periodEnd)) {
            setError("End date must be after start date");
            return;
        }

        createMutation.mutate({ periodStart, periodEnd });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
                <div className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Create Payroll Run
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="periodStart"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Period Start
                                </label>
                                <input
                                    type="date"
                                    id="periodStart"
                                    value={periodStart}
                                    onChange={(e) => setPeriodStart(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    disabled={createMutation.isPending}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="periodEnd"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Period End
                                </label>
                                <input
                                    type="date"
                                    id="periodEnd"
                                    value={periodEnd}
                                    onChange={(e) => setPeriodEnd(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    disabled={createMutation.isPending}
                                />
                            </div>

                            {error && (
                                <div className="text-sm border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={createMutation.isPending}
                                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                            >
                                {createMutation.isPending ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    "Create Run"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
