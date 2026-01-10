"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { ChatMessage as ChatMessageType, ChatRole } from "@/types/chat";
import { chatApi } from "@/api/aiChat.api";

export default function HRChatPage() {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (content: string) => {
        // Add user message
        const userMessage: ChatMessageType = {
            id: Date.now().toString(),
            role: "user",
            content,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const loadingId = "loading-" + Date.now();
            setMessages((prev) => [
                ...prev,
                {
                    id: loadingId,
                    role: "assistant",
                    content: "",
                    isLoading: true,
                },
            ]);

            const response = await chatApi.sendMessage(content);
            
            setMessages((prev) => {
                const filtered = prev.filter(msg => msg.id !== loadingId);
                return [
                    ...filtered,
                    {
                        id: Date.now().toString(),
                        role: "assistant" as ChatRole,
                        content: response.answer,
                        sources: response.sources,
                    },
                ];
            });
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => {
                const filtered = prev.filter(msg => !msg.isLoading);
                return [
                    ...filtered,
                    {
                        id: Date.now().toString(),
                        role: "assistant" as ChatRole,
                        content: "I apologize, but I'm having trouble connecting to the server. Please try again later.",
                    },
                ];
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen relative">
                {/* Header */}
                <header className="flex-none bg-white border-b border-gray-200 px-8 py-4 z-10">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        HR Assistant
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Ask questions about company policies, payroll, and benefits.
                    </p>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
                    <div className="max-w-4xl mx-auto space-y-6 pb-4">
                        {messages.length === 0 ? (
                            // Empty State
                            <div className="text-center py-20 px-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                                    <span className="text-3xl">👋</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Welcome to HR Assistant
                                </h2>
                                <p className="text-gray-500 max-w-md mx-auto mb-8">
                                    I can answer your questions about HR policies, leave applications, payroll processes, and more.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                                    {[
                                        "How are bonuses calculated?",
                                        "What is the remote work policy?",
                                        "How do I claim medical insurance?",
                                        "When is the payroll processed?",
                                    ].map((question, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSendMessage(question)}
                                            className="p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all text-sm text-gray-700"
                                        >
                                            "{question}"
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Message List
                            <>
                                {messages.map((msg) => (
                                    <ChatMessage key={msg.id} message={msg} />
                                ))}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Use footer to stick to bottom properly */}
                <footer className="flex-none bg-white">
                    <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                </footer>
            </main>
        </div>
    );
}
