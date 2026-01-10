export type ChatRole = "user" | "assistant";

export interface ChatMessage {
    id: string; // generated locally for key
    role: ChatRole;
    content: string;
    sources?: string[];
    isLoading?: boolean;
}

export interface ChatRequest {
    question: string;
    role: string | "employee"; // defaulting to employee for now as per requirements
}

export interface ChatResponse {
    answer: string;
    sources: string[];
}
