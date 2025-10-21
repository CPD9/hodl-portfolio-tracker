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
        height: '100%',
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
    <div 
      ref={containerRef}
      className="tradingview-widget-container w-full"
      style={{ height: '500px' }}
    />
  );
};

export default FearGreedIndex;
