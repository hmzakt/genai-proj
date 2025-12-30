"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/services/api";

type BatchStatus = "pending" | "processing" | "completed" | "failed";

interface BatchProcessingContextType {
    isProcessing: boolean;
    isMinimized: boolean;
    batchId: string | null;
    processedCount: number;
    totalCount: number;
    status: BatchStatus;
    startProcessing: (batchId: string) => Promise<void>;
    minimize: () => void;
    maximize: () => void;
    close: () => void;
}

const BatchProcessingContext = createContext<BatchProcessingContextType | undefined>(undefined);

export function BatchProcessingProvider({ children }: { children: ReactNode }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [batchId, setBatchId] = useState<string | null>(null);
    const [processedCount, setProcessedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [status, setStatus] = useState<BatchStatus>("pending");

    // Poll for status when processing
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isProcessing && batchId) {
            interval = setInterval(async () => {
                try {
                    const res = await api.get(`/batches/${batchId}`);
                    const batch = res.data;

                    setProcessedCount(batch.processedCount);
                    setTotalCount(batch.totalResumes);
                    setStatus(batch.status);

                    if (batch.status === "completed" || batch.status === "failed") {
                        setIsProcessing(false);
                        // Don't close immediately, let user see result
                    }
                } catch (error) {
                    console.error("Error polling batch status:", error);
                }
            }, 2000);
        }

        return () => clearInterval(interval);
    }, [isProcessing, batchId]);

    const startProcessing = async (id: string) => {
        setBatchId(id);
        setIsProcessing(true);
        setIsMinimized(false);
        setProcessedCount(0);
        setStatus("processing");
        // We assume the API call to trigger process happens in the component 
        // OR we can do it here. Let's do it here for cleaner separation.
        try {
            await api.post(`/batches/${id}/process`);
        } catch (error) {
            console.error("Failed to start processing", error);
            setStatus("failed");
            setIsProcessing(false);
            throw error;
        }
    };

    const minimize = () => setIsMinimized(true);
    const maximize = () => setIsMinimized(false);
    const close = () => {
        setIsProcessing(false);
        setBatchId(null);
        setStatus("pending");
    };

    return (
        <BatchProcessingContext.Provider value={{
            isProcessing: isProcessing || status === "completed" || status === "failed", // Keep UI open if done
            isMinimized,
            batchId,
            processedCount,
            totalCount,
            status,
            startProcessing,
            minimize,
            maximize,
            close
        }}>
            {children}
        </BatchProcessingContext.Provider>
    );
}

export function useBatchProcessing() {
    const context = useContext(BatchProcessingContext);
    if (context === undefined) {
        throw new Error("useBatchProcessing must be used within a BatchProcessingProvider");
    }
    return context;
}
