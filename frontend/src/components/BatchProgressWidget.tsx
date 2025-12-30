"use client";

import { useBatchProcessing } from "@/context/BatchProcessingContext";
import { useRouter } from "next/navigation";

export default function BatchProgressWidget() {
    const {
        isProcessing,
        isMinimized,
        status,
        processedCount,
        totalCount,
        minimize,
        maximize,
        close,
        batchId
    } = useBatchProcessing();

    const router = useRouter();

    if (!isProcessing && status !== "completed" && status !== "failed") return null;

    const percentage = totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

    const handleViewResults = () => {
        close();
        if (batchId) {
            router.push(`/batches/${batchId}/results`);
        }
    };

    // Minimized View
    if (isMinimized) {
        return (
            <div
                className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg border border-gray-200 p-4 w-72 z-50 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={maximize}
            >
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                        {status === "completed" ? "Processing Complete" : "Processing Batch..."}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); maximize(); }} className="text-gray-400 hover:text-gray-600">
                        ↗
                    </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{percentage}%</span>
                    <span>{processedCount}/{totalCount}</span>
                </div>
            </div>
        );
    }

    // Maximized View (Modal)
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    {status === "completed" ? (
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ) : status === "failed" ? (
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    ) : (
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4 animate-pulse">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-900">
                        {status === "completed" ? "Successfully Processed!" : status === "failed" ? "Processing Failed" : "Analyzing Resumes..."}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                        {status === "completed"
                            ? "All resumes have been screened by AI."
                            : status === "failed"
                                ? "Something went wrong. Please try again."
                                : "Our AI is reading through the resumes now."}
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>Progress</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${status === 'completed' ? 'bg-green-500' : 'bg-indigo-600'}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        {processedCount} of {totalCount} resumes processed
                    </p>
                </div>

                <div className="flex gap-3">
                    {status === "processing" || status === "pending" ? (
                        <button
                            onClick={minimize}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Minimize to Background
                        </button>
                    ) : (
                        <button
                            onClick={handleViewResults}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            View Results
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
