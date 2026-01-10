import React, { useState, KeyboardEvent, useRef, useEffect } from "react";

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);

        // Auto-resize
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    };

    return (
        <div className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto relative flex items-end border border-gray-300 rounded-xl shadow-sm bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about HR policies..."
                    disabled={isLoading}
                    rows={1}
                    className="w-full py-3 pl-4 pr-12 bg-transparent border-none rounded-xl resize-none focus:ring-0 text-gray-900 placeholder-gray-400 disabled:opacity-50 max-h-[120px] overflow-y-auto"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 bottom-2 p-1.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                    </svg>
                </button>
            </div>
            <div className="text-center mt-2">
                <p className="text-xs text-gray-400">
                    AI can make mistakes. Please verify important information.
                </p>
            </div>
        </div>
    );
}
