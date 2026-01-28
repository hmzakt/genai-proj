import axios from "axios";
import { ChatRequest, ChatResponse } from "@/types/chat";

// Create a separate instance for the Python AI Service
const getAiServiceUrl = () => {
    return process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";
};

const aiApi = axios.create({
    baseURL: getAiServiceUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

// REMOVED Auth interceptor to simplify CORS issues and because backend doesn't require it.
// If future requirements need auth, we can re-add it with proper CORS handling.

export const chatApi = {
    sendMessage: async (question: string): Promise<ChatResponse> => {
        const response = await aiApi.post<ChatResponse>("/api/chat", {
            question,
            role: "employee",
        } as ChatRequest);
        return response.data;
    },
};
