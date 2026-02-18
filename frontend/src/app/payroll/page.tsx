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
                <div className="flex-1 w-0 lg:w-auto min-w-0 p-3 sm:p-4 lg:p-6 xl:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                    Payroll Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-1 text-xs sm:text-sm lg:text-base">
                                    Manage payroll runs and employee payments
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 w-full sm:w-auto flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Payroll Run
                            </button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
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
