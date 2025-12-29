"use client";

import { use, useState } from "react";
import Sidebar from "@/components/Sidebar";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { Batch } from "@/types";

type Props = {
    params: Promise<{ jobId: string }>
}

export default function CreateBatchPage(props: Props) {
    const params = use(props.params);
    const jobId = params.jobId;
    const [source, setSource] = useState<"local" | "gdrive">("local");
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post<Batch>("/batches/create", {
                jobId,
                source,
                limit: Number(limit),
            });
            const batchId = response.data.id;

            // Redirect based on source to the Resume Ingestion step
            // The instructions say "Resume Ingestion (Based on Source)"
            // So we likely stay on this page or go to a new route.
            // Based on 5A/5B, there isn't a strict "Ingestion Page", but rather actions.
            // However, usually we'd want to go to a "Upload" view for that batch.
            // Let's assume we go to a generic batch view or handle it here?
            // Wait, 5A says "POST /candidates/batch-upload/:batchId".
            // Let's create a dedicated "Upload/Ingest" page for the batch: /batches/:batchId/ingest
            router.push(`/batches/${batchId}/ingest?source=${source}`);

        } catch (error) {
            console.error("Failed to create batch", error);
            alert("Failed to create batch");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center bg-white shadow-sm h-16 px-6">
                    <h2 className="text-xl font-semibold text-gray-800">Create New Screening Batch</h2>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-2xl mx-auto bg-white shadow-sm rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div>
                                <label className="text-base font-medium text-gray-900">Resume Source</label>
                                <p className="text-sm text-gray-500">Where are the resumes located?</p>
                                <fieldset className="mt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                id="source-local"
                                                name="source"
                                                type="radio"
                                                checked={source === "local"}
                                                onChange={() => setSource("local")}
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                            />
                                            <label htmlFor="source-local" className="ml-3 block text-sm font-medium text-gray-700">
                                                Local Upload (PDFs)
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="source-drive"
                                                name="source"
                                                type="radio"
                                                checked={source === "gdrive"}
                                                onChange={() => setSource("gdrive")}
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                            />
                                            <label htmlFor="source-drive" className="ml-3 block text-sm font-medium text-gray-700">
                                                Google Drive Folder
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>

                            <div>
                                <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
                                    Number of Resumes to Process
                                </label>
                                <input
                                    type="number"
                                    name="limit"
                                    id="limit"
                                    min={1}
                                    max={50}
                                    required
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Max 50 files for this plan.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Next: Ingest Resumes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
