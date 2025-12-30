"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import api from "@/services/api";
import { Job } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Only fetch if authenticated
        if (user) {
            fetchJobs();
        }
    }, [user]);

    const fetchJobs = async () => {
        try {
            const response = await api.get("/jobs");
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null; // or a loading spinner while redirecting
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex justify-between items-center bg-white shadow-sm h-16 px-6">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    <div className="flex items-center">
                        <span className="mr-4 text-sm text-gray-600">{user.email}</span>
                        <button
                            onClick={logout}
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Your Jobs</h3>
                        <Link
                            href="/jobs/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            + Create New Job
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                        <div className="bg-white shadow rounded-lg p-10 text-center">
                            <p className="text-gray-500 text-lg mb-4">No jobs found.</p>
                            <Link
                                href="/jobs/create"
                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Create your first job
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {jobs.map((job) => (
                                    <li key={job._id}>
                                        <div className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-lg font-medium text-indigo-600 truncate">
                                                        {job.title}
                                                    </p>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        {/* Add status label if available */}
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:flex sm:justify-between">
                                                    <div className="sm:flex">
                                                        <p className="flex items-center text-sm text-gray-500">
                                                            {job.description}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                        <Link href={`/jobs/${job._id}/batches/create`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                            Add Batch
                                                        </Link>
                                                        {/* Link to results/batches could go here */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
