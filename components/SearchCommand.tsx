"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2,  TrendingUp, Coins} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {searchCrypto, getMultipleCryptoData} from "@/lib/actions/coingecko.actions";
import {useDebounce} from "@/hooks/useDebounce";
import {POPULAR_CRYPTO_SYMBOLS} from "@/lib/constants";

type TabType = 'stocks' | 'crypto';

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [popularCryptos, setPopularCryptos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('stocks');

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);
  const displayCryptos = isSearchMode ? cryptos?.slice(0, 10) : popularCryptos?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Load popular cryptos when crypto tab is first accessed
  useEffect(() => {
    // Only load if crypto tab is active and popularCryptos is empty
    if (activeTab !== 'crypto' || popularCryptos.length > 0) return;
    
    const loadPopularCryptos = async () => {
      try {
        const cryptoData = await getMultipleCryptoData(POPULAR_CRYPTO_SYMBOLS);
        setPopularCryptos(cryptoData);
      } catch (error) {
        console.error('Failed to load popular cryptos:', error);
        setPopularCryptos([]);
      }
    };
    loadPopularCryptos();
  }, [activeTab, popularCryptos.length]);

  const handleSearch = async () => {
    if(!isSearchMode) {
      setStocks(initialStocks);
      setCryptos([]);
      return;
    }

    setLoading(true)
    try {
        // Search both stocks and cryptos in parallel
        const [stockResults, cryptoResults] = await Promise.all([
          searchStocks(searchTerm.trim()),
          searchCrypto(searchTerm.trim())
        ]);
        
        setStocks(stockResults);
        setCryptos(cryptoResults);
    } catch {
      setStocks([]);
      setCryptos([]);
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelect = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
    setCryptos([]);
  }

  return (
    <>
      {renderAs === 'text' ? (
          <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
      ): (
          <Button onClick={() => setOpen(true)} className="search-btn">
            {label}
          </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="search-field">
          <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search Stocks or Cryptos..." className="search-input" />
          {loading && <Loader2 className="search-loader" />}
        </div>
        
        {/* Tabs for Stocks and Crypto */}
        <div className="flex border-b border-gray-700 px-4" role="tablist" aria-label="Search tabs">
          <button
            role="tab"
            aria-selected={activeTab === 'stocks'}
            aria-controls="stocks-panel"
            onClick={() => setActiveTab('stocks')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'stocks'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <TrendingUp className="inline h-4 w-4 mr-2" />
            Stocks
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'crypto'}
            aria-controls="crypto-panel"
            onClick={() => setActiveTab('crypto')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'crypto'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Coins className="inline h-4 w-4 mr-2" />
            Crypto
          </button>
        </div>

        <CommandList className="search-list">
          {loading ? (
              <CommandEmpty className="search-list-empty">Loading results...</CommandEmpty>
          ) : (
            <>
              {/* Stocks Tab Content */}
              {activeTab === 'stocks' && (
                <div id="stocks-panel" role="tabpanel" aria-labelledby="stocks-tab">
                  {displayStocks?.length === 0 ? (
                    <div className="search-list-indicator">
                      {isSearchMode ? 'No stocks found' : 'No stocks available'}
                    </div>
                  ) : (
                    <ul className="mb-4">
                    <div className="search-count">
                      {isSearchMode ? 'Stocks' : 'Popular stocks'}
                      {` `}({displayStocks?.length || 0})
                    </div>
                    {displayStocks?.map((stock) => (
                        <li key={`stock-${stock.symbol}`} className="search-item">
              <Link
                href={`/dashboard/stocks/${stock.symbol}`}
                              onClick={handleSelect}
                              className="search-item-link"
                          >
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                            <div className="flex-1">
                              <div className="search-item-name">
                                {stock.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {stock.symbol} | {stock.exchange} | {stock.type}
                              </div>
                            </div>
                          </Link>
                        </li>
                    ))}
                  </ul>
                  )}
                </div>
              )}

              {/* Crypto Tab Content */}
              {activeTab === 'crypto' && (
                <div id="crypto-panel" role="tabpanel" aria-labelledby="crypto-tab">
                  {displayCryptos?.length === 0 ? (
                    <div className="search-list-indicator">
                      {isSearchMode ? 'No cryptocurrencies found' : 'Loading popular cryptocurrencies...'}
                    </div>
                  ) : (
                    <ul>
                    <div className="search-count">
                      {isSearchMode ? 'Cryptocurrencies' : 'Popular cryptocurrencies'}
                      {` `}({displayCryptos?.length || 0})
                    </div>
                    {displayCryptos?.map((crypto, index) => (
                        <li key={`crypto-${crypto.id || crypto.symbol || index}`} className="search-item">
              <Link
                href={`/dashboard/crypto/${(crypto.symbol || crypto.api_symbol || '').toUpperCase()}`}
                              onClick={handleSelect}
                              className="search-item-link"
                          >
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <div className="flex-1">
                              <div className="search-item-name">
                                {crypto.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(crypto.symbol || crypto.api_symbol || '').toUpperCase()}
                                {crypto.market_cap_rank && ` | Rank #${crypto.market_cap_rank}`}
                                {!isSearchMode && crypto.price && ` | $${crypto.price.toLocaleString()}`}
                              </div>
                            </div>
                          </Link>
                        </li>
                    ))}
                  </ul>
                  )}
                </div>
              )}
            </>
          )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}
