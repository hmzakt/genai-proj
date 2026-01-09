"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import EmployeeList from "@/components/employee/EmployeeList";

export default function EmployeesPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Employee Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage employee onboarding and information
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/employees/onboard")}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            Onboard New Employee
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <EmployeeList />
                    </div>
                </div>
            </div>
        </div>
    );
}
