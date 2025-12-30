import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HR AI Resume Screening",
  description: "AI-powered resume screening dashboard",
};

import { BatchProcessingProvider } from "@/context/BatchProcessingContext";
import BatchProgressWidget from "@/components/BatchProgressWidget";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <BatchProcessingProvider>
            {children}
            <BatchProgressWidget />
          </BatchProcessingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
