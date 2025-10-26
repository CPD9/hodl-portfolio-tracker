import BaseIntegration from "@/components/BaseIntegration";
import { Button } from "@/components/ui/button";
import ConsultationsTable from "@/components/consultation/ConsultationsTable";
import { OnchainSwap } from "@/components/OnchainSwap";
import { StockCryptoSwap } from "@/components/StockCryptoSwap";
import { Suspense } from "react";
import { Video } from "lucide-react";
import { auth } from "@/lib/better-auth/auth";
import { getConsultations } from "@/lib/actions/consultation.actions";
import { headers } from "next/headers";

async function ConsultationsSection() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
        <Video className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-100 mb-2">
          AI Financial Consultations
        </h3>
        <p className="text-gray-400 mb-4">
          Sign in to schedule video consultations with AI financial advisors
        </p>
        <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
          <a href="/sign-in">Sign In</a>
        </Button>
      </div>
    );
  }

  const consultationsData = await getConsultations(userId, { pageSize: 5 });

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-yellow-500 mb-2">
              AI Financial Consultations
            </h2>
            <p className="text-sm md:text-base text-gray-400">
              Get personalized advice from AI advisors via video consultation
            </p>
          </div>
          <Button
            asChild
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm w-full sm:w-auto"
          >
            <a href="/dashboard/consultation">View All</a>
          </Button>
        </div>
      </div>

      {consultationsData.consultations.length > 0 ? (
        <ConsultationsTable consultations={consultationsData.consultations} />
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <Video className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            No consultations yet
          </h3>
          <p className="text-gray-400 mb-4">
            Schedule your first AI consultation for personalized financial guidance
          </p>
          <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
            <a href="/dashboard/consultation">Schedule Consultation</a>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function BasePage() {
  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-yellow-500 mb-4">
              Base Chain Integration
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Revolutionary cross-asset trading: Swap stocks for crypto and vice versa on Base. 
              Track your portfolio, trade tokens with low fees, and access DeFi positions in one unified dashboard.
            </p>
          </div>

          {/* Base Integration Component */}
          <BaseIntegration />

          {/* Trading Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-yellow-500 mb-4">Token Swaps</h2>
              <OnchainSwap />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-yellow-500 mb-4">Stock ↔ Crypto Swap</h2>
              <StockCryptoSwap />
            </div>
          </div>

          {/* AI Consultations Section */}
          <Suspense
            fallback={
              <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto" />
                <p className="text-gray-400 mt-4">Loading consultations...</p>
              </div>
            }
          >
            <ConsultationsSection />
          </Suspense>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                Token Balances
              </h3>
              <p className="text-gray-400">
                View all your Base tokens including USDC, WETH, and other ERC-20 tokens with real-time balances.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                Portfolio Analytics
              </h3>
              <p className="text-gray-400">
                Get comprehensive portfolio insights including total value, gas spent, and performance metrics.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                DeFi Integration
              </h3>
              <p className="text-gray-400">
                Track your DeFi positions across Uniswap, Aave, and other Base protocols in one place.
              </p>
            </div>
          </div>

          {/* Base Network Info */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">
              About Base Network
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Why Base?
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Low transaction fees (up to 10x cheaper than Ethereum)</li>
                  <li>Fast transaction speeds (2-second block times)</li>
                  <li>Secure and decentralized (built on Ethereum)</li>
                  <li>Growing DeFi ecosystem</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Key Features
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Native USDC support</li>
                  <li>EVM compatibility</li>
                  <li>Coinbase integration</li>
                  <li>Developer-friendly tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
