"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/landing/Navbar";
import PayrollItemsTable from "@/components/payroll/PayrollItemsTable";

export default function PayrollItemsPage() {
    const params = useParams();
    const router = useRouter();
    const payrollRunId = params.id as string;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <div className="flex min-h-[calc(100vh-4rem)] mt-16">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <button
                                onClick={() => router.push("/payroll")}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium mb-2 flex items-center"
                            >
                                ← Back to Payroll Runs
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Payroll Items / Payslips
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                View employee payslips and payment status
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                            <PayrollItemsTable payrollRunId={payrollRunId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
