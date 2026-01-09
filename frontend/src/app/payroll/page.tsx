"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PayrollRunsList from "@/components/payroll/PayrollRunsList";
import CreatePayrollModal from "@/components/payroll/CreatePayrollModal";

export default function PayrollPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Payroll Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage payroll runs and employee payments
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            Create Payroll Run
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <PayrollRunsList />
                    </div>
                </div>
            </div>

            <CreatePayrollModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
