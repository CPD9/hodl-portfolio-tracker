"use client";

import Link from "next/link";
import { POR_DEMO_SEPOLIA_ADDRESSES } from "@/lib/constants";

export default function VerifyReservesWidget() {
  const items = Object.entries(POR_DEMO_SEPOLIA_ADDRESSES).map(([symbol, address]) => ({
    symbol,
    address,
    etherscan: `https://sepolia.etherscan.io/address/${address}`,
  }));

  return (
    <section className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-purple-500/10 p-5 md:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl md:text-2xl font-semibold text-yellow-400">Proof of Reserves (Demo)</h2>
          <Link
            href="/docs#proof-of-reserves"
            className="text-sm text-purple-300 hover:text-purple-200 underline underline-offset-4"
          >
            Read how it works
          </Link>
        </div>

        <p className="text-sm text-gray-300">
          These tokenized stock contracts are deployed on Sepolia for hackathon/demo purposes.
          Use Etherscan to verify totalSupply and transactions. In production, reserves are
          custodian-attested and oracle-verified on-chain.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.symbol}
              className="rounded-lg border border-gray-800 bg-black/40 p-4 hover:border-yellow-500/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-semibold">
                    {item.symbol[0]}
                  </span>
                  <span className="font-semibold text-gray-100">{item.symbol}</span>
                </div>
                <Link
                  href={item.etherscan}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-400 hover:text-gray-200"
                >
                  View on Etherscan ↗
                </Link>
              </div>
              <code className="block text-xs text-gray-400 truncate">{item.address}</code>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-400">
          Coverage math example: If totalSupply is 1,000 AAPL and spot price is $180, backing should be
          1,000 × $180 = $180,000 USDC. For production, this will be verified via custodian attestations
          and Chainlink oracles.
        </div>
      </div>
    </section>
  );
}
