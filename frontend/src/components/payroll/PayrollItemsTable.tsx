"use client";

import { useQuery } from "@tanstack/react-query";
import { payrollApi } from "@/services/payroll.api";
import StatusBadge from "./StatusBadge";
import { PaymentStatus } from "@/types/payroll";

interface PayrollItemsTableProps {
    payrollRunId: string;
}

export default function PayrollItemsTable({
    payrollRunId,
}: PayrollItemsTableProps) {
    const { data: items, isLoading, error } = useQuery({
        queryKey: ["payrollItems", payrollRunId],
        queryFn: () => payrollApi.getPayrollItems(payrollRunId),
        enabled: !!payrollRunId,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading payroll items...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600">
                    Error loading payroll items. Please try again.
                </div>
            </div>
        );
    }

    const formatCurrency = (amount: number, currency: string = "INR") => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Base Salary
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Incentives
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tax
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Net Pay
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items && items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {item.employeeId?.name || "Unknown"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {item.employeeId?.email || ""}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {formatCurrency(item.baseSalary, item.currency)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {formatCurrency(item.incentive, item.currency)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {formatCurrency(item.tax, item.currency)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                    {formatCurrency(item.netPay, item.currency)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.paymentStatus ? (
                                        <StatusBadge status={item.paymentStatus as PaymentStatus} />
                                    ) : (
                                        <span className="text-sm text-gray-400">N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-6 py-8 text-center text-sm text-gray-500"
                            >
                                No payroll items found for this run.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
