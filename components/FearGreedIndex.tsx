'use client';

import { useEffect, useRef } from 'react';

const FearGreedIndex = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.dataset.loaded) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        interval: '1h',
        width: '100%',
        isTransparent: true,
        height: 450,
        symbol: 'AAPL',
        showIntervalTabs: true,
        displayMode: 'single',
        locale: 'en',
        colorTheme: 'dark'
      });
      
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
      containerRef.current.dataset.loaded = 'true';
    }
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-600 overflow-hidden max-w-4xl mx-auto">
      <div 
        ref={containerRef}
        className="tradingview-widget-container w-full overflow-hidden"
        style={{ height: '450px', minHeight: '350px', overflow: 'hidden' }}
      />
    </div>
  );
};

export default FearGreedIndex;
