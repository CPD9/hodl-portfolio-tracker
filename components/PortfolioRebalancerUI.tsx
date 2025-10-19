'use client';

import {
  BASE_TOKENS,
  PORTFOLIO_REBALANCER_ABI,
  PORTFOLIO_REBALANCER_ADDRESSES,
  basisPointsToPercentage,
  percentageToBasisPoints,
} from '@/lib/contracts/portfolioRebalancer';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { useState } from 'react';

interface TokenAllocation {
  token: string;
  percentage: number;
}

export function PortfolioRebalancerUI() {
  const { address, isConnected, chain } = useAccount();
  const [portfolioName, setPortfolioName] = useState('');
  const [allocations, setAllocations] = useState<TokenAllocation[]>([
    { token: BASE_TOKENS.USDC as string, percentage: 50 },
    { token: BASE_TOKENS.WETH as string, percentage: 50 },
  ]);

  // Get contract address for current chain
  const contractAddress = chain?.id
    ? PORTFOLIO_REBALANCER_ADDRESSES[chain.id as keyof typeof PORTFOLIO_REBALANCER_ADDRESSES]
    : undefined;

  // Read user's portfolios
  const { data: userPortfolios, refetch: refetchPortfolios } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: PORTFOLIO_REBALANCER_ABI,
    functionName: 'getUserPortfolios',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  });

  // Write contract hook
  const { writeContract, data: hash, isPending } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle successful transaction
  if (isSuccess) {
    toast.success('Portfolio created successfully!');
    refetchPortfolios();
  }

  const handleCreatePortfolio = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!contractAddress) {
      toast.error('Contract not deployed on this network');
      return;
    }

    // Validate allocations sum to 100%
    const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);
    if (totalPercentage !== 100) {
      toast.error('Allocations must sum to 100%');
      return;
    }

    try {
      const tokens = allocations.map((a) => a.token as `0x${string}`);
      const percentages = allocations.map((a) => percentageToBasisPoints(a.percentage));

      writeContract({
        address: contractAddress as `0x${string}`,
        abi: PORTFOLIO_REBALANCER_ABI,
        functionName: 'createPortfolio',
        args: [portfolioName, tokens, percentages],
      });
    } catch (error) {
      console.error('Error creating portfolio:', error);
      toast.error('Failed to create portfolio');
    }
  };

  const updateAllocation = (index: number, field: 'token' | 'percentage', value: string | number) => {
    const newAllocations = [...allocations];
    if (field === 'token') {
      newAllocations[index].token = value as string;
    } else {
      newAllocations[index].percentage = Number(value);
    }
    setAllocations(newAllocations);
  };

  const addAllocation = () => {
    setAllocations([...allocations, { token: BASE_TOKENS.USDC as string, percentage: 0 }]);
  };

  const removeAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);

  if (!isConnected) {
    return (
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">
          Portfolio Rebalancer
        </h3>
        <p className="text-gray-400 mb-4">
          Connect your wallet to create automated rebalancing portfolios
        </p>
      </Card>
    );
  }

  if (!contractAddress) {
    return (
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">
          Deploy Portfolio Rebalancer
        </h3>
        <p className="text-gray-400 mb-4">
          The Portfolio Rebalancer smart contract needs to be deployed to use this feature.
        </p>
        
        <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Quick Deploy Guide</h4>
          <div className="space-y-2 text-xs text-gray-400">
            <p>1. Install Foundry:</p>
            <code className="block bg-black p-2 rounded text-green-400 overflow-x-auto">
              curl -L https://foundry.paradigm.xyz | bash && foundryup
            </code>
            
            <p>2. Set up your private key in .env:</p>
            <code className="block bg-black p-2 rounded text-green-400">
              PRIVATE_KEY=0x...
            </code>
            
            <p>3. Deploy to Base Sepolia (testnet):</p>
            <code className="block bg-black p-2 rounded text-green-400 overflow-x-auto">
              forge script contracts/script/DeployPortfolioRebalancer.s.sol --rpc-url base-sepolia --broadcast --verify
            </code>
            
            <p>4. Update .env with deployed address</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1"
          >
            <a href="https://github.com/yourusername/hodl-portfolio-tracker/blob/main/contracts/DEPLOYMENT_GUIDE.md" target="_blank" rel="noopener noreferrer">
              View Full Guide
            </a>
          </Button>
          <Button
            asChild
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <a href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet" target="_blank" rel="noopener noreferrer">
              Get Test ETH
            </a>
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Need help? Check contracts/DEPLOYMENT_GUIDE.md for detailed instructions.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Portfolio Form */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">
          Create Rebalancing Portfolio
        </h3>

        <div className="space-y-4">
          {/* Portfolio Name */}
          <div>
            <Label htmlFor="name" className="text-gray-300">
              Portfolio Name
            </Label>
            <Input
              id="name"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              placeholder="My Portfolio"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          {/* Token Allocations */}
          <div>
            <Label className="text-gray-300 mb-2 block">Token Allocations</Label>
            <div className="space-y-3">
              {allocations.map((allocation, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-400">Token</Label>
                    <select
                      value={allocation.token}
                      onChange={(e) => updateAllocation(index, 'token', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100"
                    >
                      <option value={BASE_TOKENS.USDC}>USDC</option>
                      <option value={BASE_TOKENS.WETH}>WETH</option>
                      <option value={BASE_TOKENS.DAI}>DAI</option>
                      <option value={BASE_TOKENS.cbBTC}>cbBTC</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <Label className="text-xs text-gray-400">Percentage</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={allocation.percentage}
                      onChange={(e) => updateAllocation(index, 'percentage', e.target.value)}
                      className="bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                  {allocations.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAllocation(index)}
                      className="mb-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAllocation}
                disabled={allocations.length >= 4}
              >
                Add Token
              </Button>
              <span
                className={`text-sm font-medium ${
                  totalPercentage === 100
                    ? 'text-green-400'
                    : totalPercentage > 100
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }`}
              >
                Total: {totalPercentage}%
              </span>
            </div>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreatePortfolio}
            disabled={
              !portfolioName ||
              totalPercentage !== 100 ||
              isPending ||
              isConfirming
            }
            className="w-full"
          >
            {isPending || isConfirming ? 'Creating...' : 'Create Portfolio'}
          </Button>
        </div>
      </Card>

      {/* User's Portfolios */}
      {userPortfolios && userPortfolios.length > 0 && (
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            Your Portfolios
          </h3>
          <div className="space-y-2">
            {userPortfolios.map((portfolioId, index) => (
              <div
                key={index}
                className="p-3 bg-gray-900 rounded-lg border border-gray-700"
              >
                <p className="text-gray-300">Portfolio ID: {portfolioId.toString()}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          How It Works
        </h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>Set target allocations for your portfolio (must sum to 100%)</li>
          <li>Contract automatically rebalances using Uniswap V3</li>
          <li>Rebalance anytime to maintain target ratios</li>
          <li>All transactions happen on-chain on Base</li>
        </ul>
      </Card>
    </div>
  );
}

