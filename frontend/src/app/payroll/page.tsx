"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/landing/Navbar";
import PayrollRunsList from "@/components/payroll/PayrollRunsList";
import CreatePayrollModal from "@/components/payroll/CreatePayrollModal";

export default function PayrollPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <div className="flex min-h-[calc(100vh-4rem)] mt-16">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Payroll Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">
                                Manage payroll runs and employee payments
                            </p>
                        </div>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-md"
                            >
                                Create Payroll Run
                            </button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                            <PayrollRunsList />
                        </div>
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
