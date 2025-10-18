import "./globals.css";
import '@coinbase/onchainkit/styles.css';

import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";
import { OnchainProviders } from "@/components/OnchainProviders";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HODL - Advanced Portfolio Tracker",
  description: "AI-powered stock & crypto tracking platform with Base blockchain integration. Track real-time prices, get personalized alerts, and explore detailed insights for both traditional and digital assets.",
  keywords: ["HODL", "START HACK", "Base", "Coinbase", "crypto", "stocks", "portfolio", "trading", "Web3", "DeFi"],
  authors: [{ name: "Team HODL - START HACK 2025" }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HODL',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#FFB800',
  openGraph: {
    title: "HODL - Advanced Portfolio Tracker",
    description: "AI-powered stock & crypto tracking platform with Base blockchain integration",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OnchainProviders>
          {children}
          <Toaster />
        </OnchainProviders>
      </body>
    </html>
  );
}
