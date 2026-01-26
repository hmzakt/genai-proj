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
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                    {user.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user.email}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Your Jobs</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your job postings and batches</p>
                        </div>
                        <Link
                            href="/jobs/create"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Job
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No jobs yet</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">Get started by creating your first job posting</p>
                            <Link
                                href="/jobs/create"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                Create your first job
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <div key={job._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105">
                                    <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                                            {job.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                            {job.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <Link
                                                href={`/jobs/${job._id}/batches/create`}
                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Batch
                                            </Link>
                                            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
