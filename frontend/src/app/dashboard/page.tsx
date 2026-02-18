"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/landing/Navbar";
import api from "@/services/api";
import { Job } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/payroll/ConfirmDialog";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; jobId: string | null }>({
        isOpen: false,
        jobId: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);
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

    const handleDeleteJob = async () => {
        if (!deleteConfirm.jobId) return;
        setIsDeleting(true);
        try {
            await api.delete(`/jobs/${deleteConfirm.jobId}`);
            setJobs(jobs.filter(job => job._id !== deleteConfirm.jobId));
            setDeleteConfirm({ isOpen: false, jobId: null });
        } catch (error) {
            console.error("Failed to delete job:", error);
            alert("Failed to delete job. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!user) {
        return null; // or a loading spinner while redirecting
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <div className="flex min-h-[calc(100vh-4rem)] mt-16">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden w-0 lg:w-auto min-w-0">
                    {/* Top Header */}
                    <header className="flex flex-col gap-2 sm:gap-3 bg-white dark:bg-gray-900 shadow-sm px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 border-b border-gray-200 dark:border-gray-700 min-w-0">
                        <div className="flex items-center justify-between gap-2 min-w-0">
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-indigo-600 dark:text-indigo-400 truncate">Dashboard</h2>
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs sm:text-sm font-semibold">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium truncate max-w-[100px] sm:max-w-[150px] lg:max-w-none">{user.email}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                        {/* Mobile User Info */}
                        <div className="sm:hidden flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700 min-w-0">
                            <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-semibold">
                                    {user.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate min-w-0 flex-1">{user.email}</span>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 lg:p-6 min-w-0">
                        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                            <div className="min-w-0">
                                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white break-words">Your Jobs</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs sm:text-sm lg:text-base break-words">Manage your job postings and batches</p>
                            </div>
                            <Link
                                href="/jobs/create"
                                className="inline-flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 border border-transparent text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-200 w-full sm:w-auto whitespace-nowrap"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="truncate">Create New Job</span>
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No jobs yet</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">Get started by creating your first job posting</p>
                                <Link
                                    href="/jobs/create"
                                    className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                                >
                                    Create your first job
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                                {jobs.map((job) => (
                                    <div key={job._id} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <div className="h-1.5 sm:h-2 bg-indigo-600"></div>
                                        <div className="p-3 sm:p-4 lg:p-6 min-w-0">
                                            <h4 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-900 dark:text-white mb-2 break-words line-clamp-2">
                                                {job.title}
                                            </h4>
                                            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2 break-words">
                                                {job.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <Link
                                                    href={`/jobs/${job._id}/batches/create`}
                                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap"
                                                >
                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    <span>Add Batch</span>
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteConfirm({ isOpen: true, jobId: job._id })}
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                                                    title="Delete Job"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Job"
                message="Are you sure you want to delete this job? This will also remove all associated batches and candidate data. This action cannot be undone."
                confirmText="Delete"
                onConfirm={handleDeleteJob}
                onCancel={() => setDeleteConfirm({ isOpen: false, jobId: null })}
                isLoading={isDeleting}
            />
        </div>
    );
}
