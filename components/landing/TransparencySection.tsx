'use client'

import 'boxicons/css/boxicons.min.css'

const TransparencySection = () => {
  const reserves = [
    {
      token: 'tAAPL',
      name: 'Tokenized Apple',
      amount: '1,000 shares',
      contract: '0x334dFeb48aEC27fCb75249e77F546B687cC6aB94',
      backing: '1,000 AAPL shares',
      status: 'Active'
    },
    {
      token: 'tNVDA',
      name: 'Tokenized NVIDIA',
      amount: '500 shares',
      contract: '0x7c57A5BD9942e82Ba61C27B6141c6228c38c7487',
      backing: '500 NVDA shares',
      status: 'Active'
    },
    {
      token: 'tTSLA',
      name: 'Tokenized Tesla',
      amount: '750 shares',
      contract: '0x3FF7a28970832F0B31ba496545a000971becFCC2',
      backing: '750 TSLA shares',
      status: 'Active'
    },
    {
      token: 'tAMZN',
      name: 'Tokenized Amazon',
      amount: '350 shares',
      contract: '0x8Fe92F95f0E4CAeE9494341C2B0Fbd93A2BE89A4',
      backing: '350 AMZN shares',
      status: 'Active'
    },
    {
      token: 'tGOOGL',
      name: 'Tokenized Google',
      amount: '600 shares',
      contract: '0x75687E5c95e15Ba306b49869e49F017b3103AbF2',
      backing: '600 GOOGL shares',
      status: 'Active'
    },
    {
      token: 'tMSFT',
      name: 'Tokenized Microsoft',
      amount: '450 shares',
      contract: '0x532995D5C698a725B590550F67F9f90A00b352d8',
      backing: '450 MSFT shares',
      status: 'Active'
    }
  ]

  return (
    <section id="transparency" className="py-20 px-4 lg:px-20 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-yellow-500">Transparency</span>
          </h2>
          <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            All tokenized stocks are pegged at 1-to-1 with real stock shares and backed 100% by our smart contracts on Base L2
          </p>
          <p className="text-sm text-gray-400">
            Information about tokenized assets in circulation is updated in real-time from the blockchain
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-yellow-500/30">
            <p className="text-sm text-gray-400 mb-2">Total Value Locked</p>
            <p className="text-3xl font-bold text-yellow-400">$5.2M</p>
            <p className="text-xs text-gray-500 mt-1">Across all tokenized assets</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-purple-500/30">
            <p className="text-sm text-gray-400 mb-2">Smart Contracts</p>
            <p className="text-3xl font-bold text-purple-400">Base L2</p>
            <p className="text-xs text-gray-500 mt-1">Deployed & Verified</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-green-500/30">
            <p className="text-sm text-gray-400 mb-2">Backing Ratio</p>
            <p className="text-3xl font-bold text-green-400">100%</p>
            <p className="text-xs text-gray-500 mt-1">1:1 asset backing</p>
          </div>
        </div>

        {/* Reserves Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Token</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Asset Name</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-300">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Contract Address</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Backing</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {reserves.map((reserve, index) => (
                  <tr 
                    key={index}
                    className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-yellow-400">{reserve.token}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{reserve.name}</td>
                    <td className="py-4 px-6 text-right text-gray-300">{reserve.amount}</td>
                    <td className="py-4 px-6">
                      <a 
                        href={`https://base-sepolia.blockscout.com/address/${reserve.contract}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {reserve.contract.slice(0, 6)}...{reserve.contract.slice(-4)}
                        <i className='bx bx-link-external ml-1 text-xs'></i>
                      </a>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{reserve.backing}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/30">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {reserve.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* StockCryptoSwap Contract */}
        <div className="mt-6 p-6 bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className='bx bx-shield text-white text-xl'></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-400">StockCryptoSwap (Proof of Reserves)</p>
                <a 
                  href="https://base-sepolia.blockscout.com/address/0x4833D6D51b64f93B6708088c90aB6E138b6A1547"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-purple-300 hover:text-purple-200 transition-colors"
                >
                  0x4833...1547
                  <i className='bx bx-link-external ml-1 text-xs'></i>
                </a>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/30">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Active
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 leading-relaxed">
            <i className='bx bx-info-circle text-yellow-500 mr-2'></i>
            <span className="font-semibold text-gray-300">Note:</span> All Tether tokens are pegged at 1-to-1 with a matching fiat currency (e.g., 1 USDt = 1 USD) and are backed 100% by Tether's reserves. 
            All tokenized stock tokens are pegged at 1-to-1 with real stock shares and backed 100% by HODL's smart contracts deployed on Base L2. 
            Each token can be redeemed for the underlying asset at any time. Smart contract addresses are verified on{' '}
            <a 
              href="https://basescan.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              BaseScan
              <i className='bx bx-link-external ml-1 text-xs'></i>
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default TransparencySection

