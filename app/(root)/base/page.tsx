import BaseIntegration from "@/components/BaseIntegration";

export default function BasePage() {
  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-yellow-500 mb-4">
              🚀 Base Chain Integration
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Track your Base portfolio alongside traditional stocks. Connect your wallet to see your crypto holdings, 
              DeFi positions, and transaction history in one unified dashboard.
            </p>
          </div>

          {/* Base Integration Component */}
          <BaseIntegration />

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                Token Balances
              </h3>
              <p className="text-gray-400">
                View all your Base tokens including USDC, WETH, and other ERC-20 tokens with real-time balances.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                Portfolio Analytics
              </h3>
              <p className="text-gray-400">
                Get comprehensive portfolio insights including total value, gas spent, and performance metrics.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                DeFi Integration
              </h3>
              <p className="text-gray-400">
                Track your DeFi positions across Uniswap, Aave, and other Base protocols in one place.
              </p>
            </div>
          </div>

          {/* Base Network Info */}
          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">
              🌐 About Base Network
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Why Base?
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Low transaction fees (up to 10x cheaper than Ethereum)</li>
                  <li>• Fast transaction speeds (2-second block times)</li>
                  <li>• Secure and decentralized (built on Ethereum)</li>
                  <li>• Growing DeFi ecosystem</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Key Features
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Native USDC support</li>
                  <li>• EVM compatibility</li>
                  <li>• Coinbase integration</li>
                  <li>• Developer-friendly tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
