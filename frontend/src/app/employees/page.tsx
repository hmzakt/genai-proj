"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/landing/Navbar";
import EmployeeList from "@/components/employee/EmployeeList";

export default function EmployeesPage() {
    const router = useRouter();

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
                                    Employee Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-1 text-xs sm:text-sm lg:text-base">
                                Manage employee onboarding and information
                            </p>
                        </div>
                            <button
                                onClick={() => router.push("/employees/onboard")}
                                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-md w-full sm:w-auto"
                            >
                                Onboard New Employee
                            </button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                            <EmployeeList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
