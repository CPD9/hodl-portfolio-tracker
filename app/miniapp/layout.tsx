import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HODL Mini App - Portfolio Tracker on Base",
  description: "Track stocks and crypto, execute cross-asset swaps, all on Base blockchain. Built for START HACK 2025.",
  manifest: '/miniapp-manifest.json',
  openGraph: {
    title: "HODL Portfolio Tracker",
    description: "Unified stock and crypto portfolio tracker with cross-asset swaps on Base",
    type: "website",
    images: [
      {
        url: "/assets/hodl-og-image.png",
        width: 1200,
        height: 630,
        alt: "HODL Portfolio Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HODL Portfolio Tracker",
    description: "Track stocks and crypto, swap assets seamlessly on Base",
    images: ["/assets/hodl-og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HODL",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

