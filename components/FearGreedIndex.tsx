'use client';

import { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const FearGreedIndex = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.dataset.loaded) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        interval: '1D',
        width: '100%',
        isTransparent: true,
        height: '100%',
        symbol: 'NASDAQ:SPY',
        showIntervalTabs: true,
        locale: 'en',
        colorTheme: 'dark'
      });
      
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
      containerRef.current.dataset.loaded = 'true';
    }
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-100 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-yellow-500" />
          Market Technical Analysis
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-gray-400">SPY Index</span>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ height: '400px' }}
      />
      
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-green-300 mb-1">Strong Buy</p>
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <p className="text-lg font-bold text-green-400">Bullish</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-yellow-300 mb-1">Neutral</p>
          <div className="flex items-center justify-center gap-1">
            <Activity className="w-4 h-4 text-yellow-400" />
            <p className="text-lg font-bold text-yellow-400">Hold</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-red-300 mb-1">Strong Sell</p>
          <div className="flex items-center justify-center gap-1">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <p className="text-lg font-bold text-red-400">Bearish</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
        <p className="text-xs text-gray-400">
          <span className="font-semibold text-gray-300">Technical Analysis:</span> This widget shows real-time technical indicators including Moving Averages, Oscillators, and Pivot Points for the S&P 500 (SPY), giving you a comprehensive market sentiment overview.
        </p>
      </div>
    </div>
  );
};

export default FearGreedIndex;

