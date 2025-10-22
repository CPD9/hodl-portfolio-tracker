import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import CryptoDetailsClient from "./CryptoDetailsClient";

interface CryptoDetailsPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function CryptoDetails({ params }: CryptoDetailsPageProps) {
  const { symbol } = await params;

  // Get user session
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <CryptoDetailsClient
      symbol={symbol}
      session={session}
    />
  );
}
