import Link from 'next/link'
import { POR_BASE_SEPOLIA_ADDRESSES, POR_STOCK_CRYPTO_SWAP_CONTRACT } from '@/lib/constants'

export default function VerifyReservesWidget() {
  return (
    <section className="rounded-xl border border-gray-800 bg-black/40 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-100">Proof of Reserves (Demo)</h2>
        <span className="text-xs text-gray-400">Base Sepolia • Transparency</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Hackathon / Demo Flow</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-400">
            <li>Smart contract holds all stock tokens + USDC backing</li>
            <li>Anyone can call <code className="text-yellow-400">balanceOf()</code> to verify on-chain</li>
            <li>Example: if contract holds 1,000 AAPL tokens and AAPL = $180, then USDC ≥ $180,000</li>
          </ul>

          <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900/40 p-4">
            <p className="mb-3 text-sm text-gray-300 font-medium">Token contracts (Base Sepolia)</p>
            <ul className="space-y-2 text-sm">
              {Object.entries(POR_BASE_SEPOLIA_ADDRESSES).map(([symbol, info]) => (
                <li key={symbol} className="flex items-center justify-between">
                  <span className="font-mono text-gray-200">{symbol}</span>
                  <Link href={info.blockscoutUrl} target="_blank" className="text-yellow-400 hover:text-yellow-300">
                    View on Blockscout ↗
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 rounded-lg border border-gray-800 bg-gray-900/40 p-4">
            <p className="mb-2 text-sm text-gray-300 font-medium">StockCryptoSwap (PoR related)</p>
            <Link href={POR_STOCK_CRYPTO_SWAP_CONTRACT.blockscoutUrl} target="_blank" className="text-yellow-400 hover:text-yellow-300 text-sm">
              {POR_STOCK_CRYPTO_SWAP_CONTRACT.address} ↗
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Production Roadmap</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-400">
            <li>Real-time attestations on-chain from licensed custodians</li>
            <li>Merkle tree proofs for per-user balances</li>
            <li>Independent audits similar to USDC/Tether monthly attestations</li>
            <li>Custodian flow: deposit → broker purchase → custodian hold + proof → mint token</li>
            <li>Chainlink oracle verifies custodian attestations every 24h</li>
          </ul>

          <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4 text-sm text-gray-400">
            <p className="mb-2 font-medium text-gray-300">Simple coverage check</p>
            <p>
              For each token contract above, compare token supply with custodian USDC holdings.
              Coverage should be ≥ 100% based on current reference price.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Demo disclaimer: These are testnet contracts on Base Sepolia for demonstration only.
      </p>
    </section>
  )
}
