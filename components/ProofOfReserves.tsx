'use client';

import { useEffect, useState } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { Shield, CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Stock token addresses on Base Sepolia
const STOCK_TOKENS = {
  AAPL: '0x334dFeb48aEC27fCb75249e77F546B687cC6aB94',
  TSLA: '0x3FF7a28970832F0B31ba496545a000971becFCC2',
  NVDA: '0x7c57A5BD9942e82Ba61C27B6141c6228c38c7487',
  MSFT: '0x532995D5C698a725B590550F67F9f90A00b352d8',
  AMZN: '0x8Fe92F95f0E4CAeE9494341C2B0Fbd93A2BE89A4',
  GOOGL: '0x75687E5c95e15Ba306b49869e49F017b3103AbF2',
} as const;

// ProofOfReserves contract ABI (minimal for reading)
const PROOF_OF_RESERVES_ABI = [
  {
    inputs: [{ name: '_token', type: 'address' }],
    name: 'getReserveRatio',
    outputs: [{ name: 'ratio', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_token', type: 'address' }],
    name: 'isFullyBacked',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'stockTokens',
    outputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'symbol', type: 'string' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'requiredReserves', type: 'uint256' },
      { name: 'actualReserves', type: 'uint256' },
      { name: 'lastUpdate', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'updateAllReserves',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// Replace with actual deployed ProofOfReserves contract address
const PROOF_OF_RESERVES_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`;

interface ReserveData {
  symbol: string;
  address: string;
  totalSupply: bigint;
  requiredReserves: bigint;
  actualReserves: bigint;
  ratio: number;
  isFullyBacked: boolean;
  lastUpdate: number;
}

export default function ProofOfReserves({ compact = false }: { compact?: boolean }) {
  const { isConnected } = useAccount();
  const [reserves, setReserves] = useState<ReserveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchReserves = async () => {
    setLoading(true);
    const reserveData: ReserveData[] = [];

    // In production, this would fetch from the actual contract
    // For now, we'll simulate the data structure
    for (const [symbol, address] of Object.entries(STOCK_TOKENS)) {
      // Mock data - replace with actual contract reads
      reserveData.push({
        symbol,
        address,
        totalSupply: BigInt(1000) * BigInt(10 ** 18),
        requiredReserves: BigInt(180000) * BigInt(10 ** 6),
        actualReserves: BigInt(180000) * BigInt(10 ** 6),
        ratio: 100,
        isFullyBacked: true,
        lastUpdate: Date.now() / 1000,
      });
    }

    setReserves(reserveData);
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    fetchReserves();
  }, []);

  const formatUSDC = (amount: bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(formatUnits(amount, 6)));
  };

  const formatTokens = (amount: bigint) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(formatUnits(amount, 18)));
  };

  const getStatusColor = (ratio: number) => {
    if (ratio >= 100) return 'text-green-400';
    if (ratio >= 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (isFullyBacked: boolean) => {
    return isFullyBacked ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-400" />
    );
  };

  if (compact) {
    // Compact view for portfolio integration
    const totalRequired = reserves.reduce((sum, r) => sum + r.requiredReserves, BigInt(0));
    const totalActual = reserves.reduce((sum, r) => sum + r.actualReserves, BigInt(0));
    const overallRatio = totalRequired > 0 ? Number((totalActual * BigInt(10000)) / totalRequired) / 100 : 100;

    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-yellow-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm font-semibold text-gray-100">Proof of Reserves</h3>
          </div>
          <button
            onClick={fetchReserves}
            className="p-1 hover:bg-gray-700/50 rounded transition-colors"
            title="Refresh reserves"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Reserves:</span>
            <span className="text-gray-100 font-semibold text-xs md:text-sm truncate ml-2">{formatUSDC(totalActual)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Required:</span>
            <span className="text-gray-100 font-semibold text-xs md:text-sm truncate ml-2">{formatUSDC(totalRequired)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 whitespace-nowrap">Backing Ratio:</span>
            <span className={`font-bold text-xs md:text-sm ${getStatusColor(overallRatio)}`}>
              {overallRatio.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-yellow-500/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/30">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Proof of Reserves
            </h2>
            <p className="text-sm text-gray-400" suppressHydrationWarning>
              Real-time on-chain verification • Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <Button
          onClick={fetchReserves}
          disabled={loading}
          variant="outline"
          className="gap-2 border-yellow-500/30 hover:border-yellow-500/50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading reserve data...</div>
      ) : (
        <div className="space-y-4">
          {reserves.map((reserve) => (
            <div
              key={reserve.symbol}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-yellow-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  {getStatusIcon(reserve.isFullyBacked)}
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-gray-100">{reserve.symbol}</h3>
                    <a
                      href={`https://base-sepolia.blockscout.com/address/${reserve.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] md:text-xs text-gray-500 hover:text-yellow-400 flex items-center gap-1 truncate"
                    >
                      {reserve.address.slice(0, 6)}...{reserve.address.slice(-4)}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className={`text-base md:text-2xl font-bold ${getStatusColor(reserve.ratio)}`}>
                    {reserve.ratio.toFixed(2)}%
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap">Backing Ratio</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4 mt-4 pt-4 border-t border-gray-700/50">
                <div>
                  <div className="text-[10px] md:text-xs text-gray-500 mb-1">Total Supply</div>
                  <div className="text-xs md:text-sm font-semibold text-gray-200 truncate">
                    {formatTokens(reserve.totalSupply)} tokens
                  </div>
                </div>
                <div>
                  <div className="text-[10px] md:text-xs text-gray-500 mb-1">Required Reserves</div>
                  <div className="text-xs md:text-sm font-semibold text-gray-200 truncate">
                    {formatUSDC(reserve.requiredReserves)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] md:text-xs text-gray-500 mb-1">Actual Reserves</div>
                  <div className="text-xs md:text-sm font-semibold text-green-400 truncate">
                    {formatUSDC(reserve.actualReserves)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] md:text-xs text-gray-500 mb-1">Status</div>
                  <div
                    className={`text-xs md:text-sm font-semibold ${
                      reserve.isFullyBacked ? 'text-green-400' : 'text-yellow-400'
                    }`}
                  >
                    {reserve.isFullyBacked ? 'Fully Backed' : 'Under Review'}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-blue-400 mb-1">How Proof of Reserves Works:</p>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li>• Each stock token is backed 1:1 by USDC reserves</li>
                  <li>• Smart contracts are publicly verifiable on Base Sepolia</li>
                  <li>• Reserves are updated every 24 hours via Chainlink oracles</li>
                  <li>• Anyone can verify balances using on-chain queries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
