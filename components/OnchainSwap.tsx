'use client';

import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToast,
  SwapToggleButton,
} from '@coinbase/onchainkit/swap';

import { Token } from '@coinbase/onchainkit/token';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

// Base Mainnet tokens
const BASE_ETH: Token = {
  address: '',
  chainId: 8453,
  decimals: 18,
  name: 'Ethereum',
  symbol: 'ETH',
  image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
};

const USDC: Token = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  chainId: 8453,
  decimals: 6,
  name: 'USDC',
  symbol: 'USDC',
  image: 'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
};

const DAI: Token = {
  address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  chainId: 8453,
  decimals: 18,
  name: 'Dai Stablecoin',
  symbol: 'DAI',
  image: 'https://ethereum-optimism.github.io/data/DAI/logo.svg',
};

const WETH: Token = {
  address: '0x4200000000000000000000000000000000000006',
  chainId: 8453,
  decimals: 18,
  name: 'Wrapped Ether',
  symbol: 'WETH',
  image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
};

const CBBTC: Token = {
  address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
  chainId: 8453,
  decimals: 8,
  name: 'Coinbase Wrapped BTC',
  symbol: 'cbBTC',
  image: 'https://assets.coingecko.com/coins/images/28171/large/cb-btc.png',
};

export function OnchainSwap() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg border border-gray-700">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            Connect Wallet to Swap
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Connect your wallet to trade tokens on Base network
          </p>
        </div>
        <Wallet>
          <div className="w-full" />
        </Wallet>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">
          Swap Tokens on Base
        </h3>
        <p className="text-sm text-gray-400">
          Trade cryptocurrencies directly on the Base blockchain with low fees
        </p>
      </div>
      
      <Swap>
        <SwapAmountInput
          label="You pay"
          swappableTokens={[BASE_ETH, USDC, DAI, WETH, CBBTC]}
          token={BASE_ETH}
          type="from"
        />
        <SwapToggleButton />
        <SwapAmountInput
          label="You receive"
          swappableTokens={[BASE_ETH, USDC, DAI, WETH, CBBTC]}
          token={USDC}
          type="to"
        />
        <SwapButton />
        <SwapMessage />
        <SwapToast />
      </Swap>

      <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          Trading Information
        </h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>Powered by Uniswap V3 on Base</li>
          <li>Low gas fees (~$0.01 per transaction)</li>
          <li>Real blockchain transactions</li>
          <li>Instant settlement</li>
        </ul>
      </div>
    </div>
  );
}

