import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BatchProcessingProvider } from "@/context/BatchProcessingContext";
import BatchProgressWidget from "@/components/BatchProgressWidget";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HR AI Resume Screening",
  description: "AI-powered resume screening dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <BatchProcessingProvider>
              {children}
              <BatchProgressWidget />
            </BatchProcessingProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
