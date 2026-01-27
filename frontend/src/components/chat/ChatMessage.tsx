import React from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import ChatLoader from "./ChatLoader";
import SourceList from "./SourceList";

interface ChatMessageProps {
    message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isBot = message.role === "assistant";

    return (
        <div
            className={`flex w-full ${isBot ? "justify-start" : "justify-end"
                }`}
        >
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${isBot
                    ? "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-tl-none"
                    : "bg-indigo-600 dark:bg-indigo-600 text-white rounded-tr-none shadow-sm"
                    }`}
            >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                </div>

                {message.isLoading && <ChatLoader />}
            </div>
        </div>
    );
}
