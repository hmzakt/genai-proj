"use client";

import { use, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import api from "@/services/api";

type Props = {
    params: Promise<{ batchId: string }>
}

import { useBatchProcessing } from "@/context/BatchProcessingContext";

// ... imports

function IngestContent({ batchId }: { batchId: string }) {
    const searchParams = useSearchParams();
    const source = searchParams.get("source") as "local" | "gdrive" || "local";

    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    // Removed local processing state
    const [uploadComplete, setUploadComplete] = useState(false);

    const { startProcessing, isProcessing } = useBatchProcessing();

    // Handle File Upload (Local)
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("resumes", file);
        });

        try {
            await api.post(`/candidates/batch-upload/${batchId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploadComplete(true);
            alert("Files uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    // Handle GDrive Fetch
    const handleDriveConnect = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        window.location.href = `${apiUrl}/auth/google`;
    };

    const handleDriveFetch = async () => {
        setUploading(true);
        try {
            await api.post(`/candidates/batch-upload-gdrive/${batchId}`);
            setUploadComplete(true);
            alert("Fetch initiated from Drive!");
        } catch (error) {
            console.error("Drive fetch failed", error);
            alert("Drive fetch failed");
        } finally {
            setUploading(false);
        }
    };

    // Process Batch
    const handleProcess = async () => {
        try {
            await startProcessing(batchId);
            // Router push is handled by the widget/context completion now, or user can click View Results
        } catch (error) {
            console.error("Processing failed", error);
            alert("Processing request failed");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Source: {source === 'local' ? 'Local Upload' : 'Google Drive'}
            </h3>

            {/* Step 1: Ingestion */}
            {!uploadComplete && (
                <div className="mb-10">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Step 1: Upload Resumes</h3>

                    {source === "local" ? (
                        <form onSubmit={handleFileUpload} className="space-y-6">
                            {/* ... form content ... */}
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 flex justify-center items-center">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload PDFs</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept=".pdf" onChange={(e) => setFiles(e.target.files)} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB each</p>
                                </div>
                            </div>
                            {files && <div className="text-sm text-gray-600 dark:text-gray-400">Selected {files.length} files.</div>}
                            <button type="submit" disabled={uploading || !files} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-gray-400">
                                {uploading ? "Uploading..." : "Upload Files"}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6 text-center">
                            <p className="text-gray-600 dark:text-gray-400">Connect to Google Drive to select resumes.</p>
                            <button onClick={handleDriveConnect} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                Connect Google Drive
                            </button>
                            <div className="mt-4">
                                <button onClick={handleDriveFetch} disabled={uploading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-gray-400">
                                    {uploading ? "Fetching..." : "Fetch Resumes from Drive"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Process */}
            <div className={`border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 ${!uploadComplete ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">Step 2: Process Screening</h3>
                <button onClick={handleProcess} disabled={isProcessing} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-400">
                    Process Batch
                </button>
            </div>
        </div>
    );
}

export default function IngestBatchPage(props: Props) {
    const params = use(props.params);

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden w-0 lg:w-auto min-w-0">
                <header className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm min-h-16 px-4 sm:px-6 py-3 sm:py-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                        Ingest Resumes
                    </h2>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
                    <Suspense fallback={<div className="text-gray-700 dark:text-gray-300">Loading source...</div>}>
                        <IngestContent batchId={params.batchId} />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
