"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/landing/Navbar";
import EmployeeOnboardingWizard from "@/components/employee/EmployeeOnboardingWizard";

export default function OnboardEmployeePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <div className="flex min-h-[calc(100vh-4rem)] mt-16">
                <Sidebar />
                <div className="flex-1 w-0 lg:w-auto min-w-0 p-3 sm:p-4 lg:p-6 xl:p-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Onboard New Employee
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
                                Complete the 3-step process to onboard a new employee
                            </p>
                        </div>

                        <EmployeeOnboardingWizard />
                    </div>
                </div>
            </div>
        </div>
    );
}
