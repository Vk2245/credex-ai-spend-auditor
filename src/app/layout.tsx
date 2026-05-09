import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// ── Font Setup ──
// Inter is one of the most readable UI fonts, widely used in SaaS products.
// Using Google Fonts via next/font gives us automatic optimization (no CLS).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// ── SEO Metadata ──
// This is the default metadata for all pages.
// Individual pages can override these values.
export const metadata: Metadata = {
  title: {
    default: "AI Spend Audit — Credex",
    template: "%s | AI Spend Audit — Credex",
  },
  description:
    "Free AI tool spend audit for startups. Find out where you're overspending on Cursor, Copilot, ChatGPT, Claude, and more — get actionable savings recommendations instantly.",
  keywords: [
    "AI spend audit",
    "startup cost optimization",
    "Cursor pricing",
    "ChatGPT cost",
    "Claude pricing",
    "GitHub Copilot cost",
    "AI tool comparison",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Credex AI Spend Audit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
