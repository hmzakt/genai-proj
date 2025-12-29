"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Dashboard" },
        // Add other links here if needed
    ];

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <div className="mb-8 p-4">
                <h1 className="text-xl font-bold">HR AI Platform</h1>
            </div>
            <nav className="space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block px-4 py-2 rounded-md transition-colors ${isActive
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
