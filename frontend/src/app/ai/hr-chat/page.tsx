"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/landing/Navbar";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { ChatMessage as ChatMessageType, ChatRole } from "@/types/chat";
import { chatApi } from "@/api/aiChat.api";

export default function HRChatPage() {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const chatContainer = messagesEndRef.current.closest('.overflow-y-auto');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
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
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <div className="flex h-[calc(100vh-4rem)] mt-16 overflow-hidden">
                <Sidebar />

                <main className="flex-1 flex flex-col h-full relative bg-white dark:bg-gray-900">
                    {/* Header */}
                    <header className="flex-none bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8 py-4 z-10">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                HR Assistant
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                Ask questions about company policies, payroll, and benefits.
                            </p>
                        </div>
                    </header>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:px-8 lg:pt-8 lg:pb-4 scroll-smooth bg-white dark:bg-gray-900">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {messages.length === 0 ? (
                                // Empty State
                                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                                        <span className="text-3xl">👋</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                                        Welcome to HR Assistant
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8 text-center">
                                        I can answer your questions about HR policies, leave applications, payroll processes, and more.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                                        {[
                                            "How are bonuses calculated?",
                                            "What is the remote work policy?",
                                            "How do I claim medical insurance?",
                                            "When is the payroll processed?",
                                        ].map((question, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSendMessage(question)}
                                                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:shadow-sm transition-all text-sm text-left text-gray-700 dark:text-gray-300"
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
                            <div ref={messagesEndRef} className="h-0" />
                        </div>
                    </div>

                    {/* Use footer to stick to bottom properly */}
                    <footer className="flex-none bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                    </footer>
                </main>
            </div>
        </div>
    );
}
