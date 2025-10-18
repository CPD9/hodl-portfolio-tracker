"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2,  TrendingUp, Coins} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {searchCrypto, getCryptoMarketData} from "@/lib/actions/coingecko.actions";
import {useDebounce} from "@/hooks/useDebounce";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
  const [cryptos, setCryptos] = useState<any[]>([]);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);
  const displayCryptos = cryptos?.slice(0, 5); // Show top 5 crypto results

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
        <CommandList className="search-list">
          {loading ? (
              <CommandEmpty className="search-list-empty">Loading results...</CommandEmpty>
          ) : (displayStocks?.length === 0 && displayCryptos?.length === 0) ? (
              <div className="search-list-indicator">
                {isSearchMode ? 'No results found' : 'No stocks available'}
              </div>
            ) : (
            <>
              {/* Stocks Section */}
              {displayStocks?.length > 0 && (
                <ul className="mb-4">
                  <div className="search-count">
                    {isSearchMode ? 'Stocks' : 'Popular stocks'}
                    {` `}({displayStocks?.length || 0})
                  </div>
                  {displayStocks?.map((stock) => (
                      <li key={`stock-${stock.symbol}`} className="search-item">
                        <Link
                            href={`/stocks/${stock.symbol}`}
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

              {/* Cryptos Section */}
              {displayCryptos?.length > 0 && (
                <ul>
                  <div className="search-count">
                    Cryptocurrencies ({displayCryptos?.length || 0})
                  </div>
                  {displayCryptos?.map((crypto) => (
                      <li key={`crypto-${crypto.id}`} className="search-item">
                        <Link
                            href={`/crypto/${crypto.symbol.toUpperCase()}`}
                            onClick={handleSelect}
                            className="search-item-link"
                        >
                          <Coins className="h-4 w-4 text-yellow-500" />
                          <div className="flex-1">
                            <div className="search-item-name">
                              {crypto.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {crypto.symbol.toUpperCase()} | Rank #{crypto.market_cap_rank || 'N/A'}
                            </div>
                          </div>
                        </Link>
                      </li>
                  ))}
                </ul>
              )}
            </>
          )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}
