// Smoke-test Uniswap V3 Quoter on Base/Base Sepolia using env-provided addresses
// Usage: npm run test:swap:quote
// Requires env: RPC URL, QUOTER address, tokenIn/out, decimals and amount

import 'dotenv/config';
import { createPublicClient, http, parseUnits, formatUnits } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import quoterAbi from '../lib/swap/abis/quoterV2.json' assert { type: 'json' };

async function main() {
  const sepoliaRpc = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL;
  const mainnetRpc = process.env.NEXT_PUBLIC_BASE_RPC_URL;
  const rpcUrl = sepoliaRpc || mainnetRpc;
  if (!rpcUrl) {
    console.error('Missing RPC URL. Set NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL or NEXT_PUBLIC_BASE_RPC_URL');
    process.exit(1);
  }

  const chain = sepoliaRpc ? baseSepolia : base;
  const client = createPublicClient({ chain, transport: http(rpcUrl) });

  const quoter = process.env.NEXT_PUBLIC_UNISWAP_V3_QUOTER_ADDRESS;
  if (!quoter) {
    console.error('Missing NEXT_PUBLIC_UNISWAP_V3_QUOTER_ADDRESS');
    process.exit(1);
  }

  const tokenIn = process.env.TEST_TOKEN_IN;
  const tokenOut = process.env.TEST_TOKEN_OUT;
  const decimalsIn = Number(process.env.TEST_DECIMALS_IN || '18');
  const decimalsOut = Number(process.env.TEST_DECIMALS_OUT || '6');
  const amountInHuman = process.env.TEST_AMOUNT_IN || '0.01';
  const fee = Number(process.env.TEST_POOL_FEE || '3000');

  if (!tokenIn || !tokenOut) {
    console.error('Missing TEST_TOKEN_IN/TEST_TOKEN_OUT. Provide token addresses for your network.');
    process.exit(1);
  }

  const amountIn = parseUnits(amountInHuman, decimalsIn);

  console.log('Chain:', chain.name);
  console.log('Quoter:', quoter);
  console.log('Path:', `${tokenIn} -> ${tokenOut} (fee ${fee})`);
  console.log('Amount In:', amountInHuman);

  try {
    const [amountOut] = await client.readContract({
      address: quoter,
      abi: quoterAbi,
      functionName: 'quoteExactInputSingle',
      args: [
        {
          tokenIn,
          tokenOut,
          fee: BigInt(fee),
          amountIn,
          sqrtPriceLimitX96: 0n,
        },
      ],
    });

    console.log('Quote amountOut (raw):', amountOut.toString());
    console.log('Quote amountOut (formatted):', formatUnits(amountOut, decimalsOut));
    console.log('SUCCESS: Quoter responded. Liquidity likely present.');
  } catch (err) {
    console.error('Quoter call failed. This often means the pool has no liquidity or addresses are wrong.');
    console.error(String(err));
    process.exit(2);
  }
}

main();
