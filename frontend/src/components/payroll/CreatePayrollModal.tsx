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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Create Payroll Run
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="periodStart"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Period Start
                                </label>
                                <input
                                    type="date"
                                    id="periodStart"
                                    value={periodStart}
                                    onChange={(e) => setPeriodStart(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    disabled={createMutation.isPending}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="periodEnd"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Period End
                                </label>
                                <input
                                    type="date"
                                    id="periodEnd"
                                    value={periodEnd}
                                    onChange={(e) => setPeriodEnd(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    disabled={createMutation.isPending}
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={createMutation.isPending}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createMutation.isPending ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
