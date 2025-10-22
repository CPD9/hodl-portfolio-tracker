import { getCorrelatedCrypto, getStockCryptoComparison } from "@/lib/actions/correlation.actions";
import { auth } from "@/lib/better-auth/auth";
import { getStockQuote } from "@/lib/actions/finnhub.actions";
import { getUserPosition } from "@/lib/actions/stock-trading.actions";
import { headers } from "next/headers";
import { isInWatchlist } from "@/lib/actions/watchlist.actions";
import StockDetailsClient from "./StockDetailsClient";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;

  // Get user session and check if stock is in watchlist
  const session = await auth.api.getSession({ headers: await headers() });
  let isInUserWatchlist = false;
  let userPosition = null;
  let currentPrice = 0;
  let correlatedCrypto = null;

  // Fetch stock quote for current price
  const quote = await getStockQuote(symbol);
  currentPrice = quote?.c || 0;

  if (session?.user?.id) {
    isInUserWatchlist = await isInWatchlist(session.user.id, symbol);
    userPosition = await getUserPosition(session.user.id, symbol);
  }

  // Get correlated crypto for this stock
  correlatedCrypto = await getCorrelatedCrypto(symbol);
  
  // Get comparison symbols for TradingView
  const comparisonData = await getStockCryptoComparison(symbol);

  return (
    <StockDetailsClient
      symbol={symbol}
      isInUserWatchlist={isInUserWatchlist}
      userPosition={userPosition}
      currentPrice={currentPrice}
      correlatedCrypto={correlatedCrypto}
      comparisonData={comparisonData}
      session={session}
    />
  );
}
