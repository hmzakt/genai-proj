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
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg sm:rounded-xl lg:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${isBot
                    ? "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-tl-none"
                    : "bg-indigo-600 dark:bg-indigo-600 text-white rounded-tr-none shadow-sm"
                    }`}
            >
                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">
                    {message.content}
                </div>

                {message.isLoading && <ChatLoader />}
            </div>
        </div>
    );
}
