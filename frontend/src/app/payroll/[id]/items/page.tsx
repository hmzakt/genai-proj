"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import PayrollItemsTable from "@/components/payroll/PayrollItemsTable";

export default function PayrollItemsPage() {
    const params = useParams();
    const router = useRouter();
    const payrollRunId = params.id as string;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <button
                            onClick={() => router.push("/payroll")}
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-2 flex items-center"
                        >
                            ← Back to Payroll Runs
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Payroll Items / Payslips
                        </h1>
                        <p className="text-gray-600 mt-1">
                            View employee payslips and payment status
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <PayrollItemsTable payrollRunId={payrollRunId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
