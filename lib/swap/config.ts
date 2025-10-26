export type SwapEnv = {
  chainPreference?: 'base' | 'baseSepolia';
  slippageBps: number; // e.g., 50 => 0.50%
  deadlineSec: number; // e.g., 120 seconds
  quoterAddress?: string; // optional override per env
};

export function getSwapEnv(): SwapEnv {
  const chainPreference = (process.env.NEXT_PUBLIC_SWAP_CHAIN || '').toLowerCase() as
    | 'base'
    | 'baseSepolia'
    | undefined;
  const slippageBps = Number(process.env.NEXT_PUBLIC_SLIPPAGE_BPS || '50');
  const deadlineSec = Number(process.env.NEXT_PUBLIC_SWAP_DEADLINE_SEC || '120');
  const quoterAddress = process.env.NEXT_PUBLIC_UNISWAP_V3_QUOTER_ADDRESS || undefined;

  return {
    chainPreference,
    slippageBps: Number.isFinite(slippageBps) ? slippageBps : 50,
    deadlineSec: Number.isFinite(deadlineSec) ? deadlineSec : 120,
    quoterAddress,
  };
}
