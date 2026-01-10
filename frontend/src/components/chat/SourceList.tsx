import React from "react";

interface SourceListProps {
    sources: string[];
}

export default function SourceList({ sources }: SourceListProps) {
    if (!sources || sources.length === 0) {
        return (
            <div className="mt-2 text-xs text-gray-400 italic">
                No document source found
            </div>
        );
    }

    return (
        <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-gray-500 w-full">Sources:</span>
            {sources.map((source, index) => (
                <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                    title={source}
                >
                    📄 {source}
                </span>
            ))}
        </div>
    );
}
