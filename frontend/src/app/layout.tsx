import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-fredoka" });

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
      <body className={`${fredoka.variable} font-playful antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(42, 36, 31, 0.94)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              color: "#fef3c7",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
