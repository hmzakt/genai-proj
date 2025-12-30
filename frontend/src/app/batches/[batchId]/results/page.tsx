"use client";

import { use, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import api from "@/services/api";
import { Candidate } from "@/types";
import Link from "next/link";

type Props = {
    params: Promise<{ batchId: string }>
}

export default function ResultsPage(props: Props) {
    const params = use(props.params);
    const batchId = params.batchId;
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, [batchId]);

    const fetchResults = async () => {
        try {
            const response = await api.get<Candidate[]>(`/batches/${batchId}/results`);
            // Sort by score DESC locally just in case backend doesn't, though requirements say backend should.
            // But "Display table... Sort by score DESC" implies we ensure it.
            const sorted = response.data.sort((a, b) => b.score - a.score);
            setCandidates(sorted);
        } catch (error) {
            console.error("Failed to fetch results", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return "bg-green-100 text-green-800";
            case "processing": return "bg-yellow-100 text-yellow-800";
            case "failed": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center bg-white shadow-sm h-16 px-6">
                    <h2 className="text-xl font-semibold text-gray-800">Batch Results</h2>
                    <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900">
                        Back to Dashboard
                    </Link>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    {loading ? (
                                        <div className="text-center py-10 bg-white">Loading results...</div>
                                    ) : candidates.length === 0 ? (
                                        <div className="text-center py-10 bg-white">No results found yet. Processing might still be in progress.</div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Rank
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Candidate Name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Score
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Summary
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {candidates.map((candidate, index) => (
                                                    <tr key={candidate._id || index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {candidate.name || `Candidate ${index + 1}`}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                            {candidate.score}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                                                                {candidate.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={candidate.summary}>
                                                            {candidate.summary}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
