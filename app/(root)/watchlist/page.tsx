import SearchCommand from "@/components/SearchCommand";
import WatchlistTable from "@/components/WatchlistTable";
import { auth } from "@/lib/better-auth/auth";
import { getStockQuote } from "@/lib/actions/finnhub.actions";
import { getWatchlistByUserId } from "@/lib/actions/watchlist.actions";
import { headers } from "next/headers";

export default async function WatchlistPage() {
  // Get user session (authentication is already handled by the root layout)
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Please sign in to view your watchlist</h1>
          <p className="text-gray-400">You need to be logged in to access your watchlist.</p>
        </div>
      </div>
    );
  }

  const watchlistItems = await getWatchlistByUserId(userId);

  // Get current stock data for each watchlist item
  const watchlistWithData = await Promise.all(
    watchlistItems.map(async (item) => {
      try {
        const quote = await getStockQuote(item.symbol);
        return {
          ...item, // Already serialized by the action
          currentPrice: quote?.c || 0,
          change: quote?.d || 0,
          changePercent: quote?.dp || 0,
          marketCap: quote?.marketCapitalization || 0,
          pe: quote?.pe || 0,
        };
      } catch (error) {
        console.error(`Error fetching data for ${item.symbol}:`, error);
        return {
          ...item, // Already serialized by the action
          currentPrice: 0,
          change: 0,
          changePercent: 0,
          marketCap: 0,
          pe: 0,
        };
      }
    })
  );

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="watchlist-title">My Watchlist</h1>
              <p className="text-gray-400 mt-2">
                Track your favorite stocks and get real-time updates
              </p>
            </div>
            <SearchCommand 
              renderAs="button" 
              label="Add Stock" 
              initialStocks={[]}
            />
          </div>

          {/* Watchlist Content */}
          {watchlistWithData.length === 0 ? (
            <div className="watchlist-empty-container">
              <div className="watchlist-empty">
                <svg
                  className="watchlist-star"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                  />
                </svg>
                <h2 className="empty-title">Your watchlist is empty</h2>
                <p className="empty-description">
                  Start building your watchlist by adding stocks you want to track. 
                  Use the "Add Stock" button above to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className="watchlist-container">
              <div className="watchlist">
                <WatchlistTable watchlist={watchlistWithData} userId={userId} />
              </div>
              <div className="watchlist-alerts">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Set Price Alert
                    </button>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Export to CSV
                    </button>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Share Watchlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
