import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BrainBridge AI – Connecting Students, AI & Teachers",
  description:
    "An all-in-one intelligent learning platform with AI study planning, voice-based learning in Amharic & English, and a teacher-verified Q&A knowledge base.",
  keywords: ["AI learning", "study planner", "Amharic education", "Q&A", "voice learning"],
  openGraph: {
    title: "BrainBridge AI",
    description: "Study smarter with AI-powered learning tools",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(15,20,40,0.95)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#e2e8f0",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
