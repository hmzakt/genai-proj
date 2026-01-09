"use client";

import Sidebar from "@/components/Sidebar";
import EmployeeOnboardingWizard from "@/components/employee/EmployeeOnboardingWizard";

export default function OnboardEmployeePage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Onboard New Employee
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Complete the 3-step process to onboard a new employee
                        </p>
                    </div>

                    <EmployeeOnboardingWizard />
                </div>
            </div>
        </div>
    );
}
