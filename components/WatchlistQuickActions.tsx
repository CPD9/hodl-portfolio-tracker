'use client';

import { toast } from 'sonner';
import { triggerDailyNewsSummary } from '@/lib/actions/watchlist.actions';
import { useState } from 'react';

interface WatchlistQuickActionsProps {
  watchlist: StockWithData[];
  userId: string;
  userEmail?: string;
}

export default function WatchlistQuickActions({ watchlist, userId, userEmail }: WatchlistQuickActionsProps) {
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const handleTriggerNews = async () => {
    setIsLoadingNews(true);
    try {
      const result = await triggerDailyNewsSummary(userId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to trigger news summary');
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Symbol', 'Company', 'Price', 'Change', 'Change %', 'Market Cap', 'P/E Ratio'];
      const rows = watchlist.map(stock => [
        stock.symbol,
        stock.company,
        stock.currentPrice?.toFixed(2) || 'N/A',
        stock.change?.toFixed(2) || 'N/A',
        stock.changePercent?.toFixed(2) || 'N/A',
        stock.marketCap?.toString() || 'N/A',
        stock.pe?.toFixed(2) || 'N/A',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `watchlist_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Watchlist exported successfully!');
    } catch (error) {
      toast.error('Failed to export watchlist');
    }
  };

  const handleShareWatchlist = async () => {
    const symbols = watchlist.map(s => s.symbol).join(', ');
    const shareText = `Check out my HODL watchlist: ${symbols}`;
    const shareUrl = `${window.location.origin}/watchlist`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My HODL Watchlist',
          text: shareText,
          url: shareUrl,
        });
        toast.success('Watchlist shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          handleCopyToClipboard(shareText, shareUrl);
        }
      }
    } else {
      handleCopyToClipboard(shareText, shareUrl);
    }
  };

  const handleCopyToClipboard = (text: string, url: string) => {
    const fullText = `${text}\n${url}`;
    navigator.clipboard.writeText(fullText).then(
      () => toast.success('Watchlist link copied to clipboard!'),
      () => toast.error('Failed to copy to clipboard')
    );
  };

  return (
    <div className="watchlist-alerts">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowAlertDialog(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Set Price Alert
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Export to CSV
          </button>
          <button
            onClick={handleShareWatchlist}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Share Watchlist
          </button>
          <button
            onClick={handleTriggerNews}
            disabled={isLoadingNews}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingNews ? 'Sending...' : '📧 Get Daily News Summary'}
          </button>
        </div>
      </div>

      {userEmail && (
        <div className="bg-gray-800 rounded-lg p-6 mt-4">
          <h3 className="text-lg font-semibold text-gray-100 mb-2">📬 Email Updates</h3>
          <p className="text-sm text-gray-400 mb-2">
            Daily market news summaries will be sent to:
          </p>
          <p className="text-sm text-blue-400 font-mono">{userEmail}</p>
        </div>
      )}
    </div>
  );
}

