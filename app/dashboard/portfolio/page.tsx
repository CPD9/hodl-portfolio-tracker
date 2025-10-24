import { getPortfolioSummary, getTransactionHistory } from '@/lib/actions/portfolio.actions';

import PortfolioDashboard from '@/components/PortfolioDashboard';
import TransactionHistory from '@/components/TransactionHistory';
import VerifyReservesWidget from '@/components/VerifyReservesWidget';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function PortfolioPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const portfolioData = await getPortfolioSummary(session.user.id);
  const transactions = await getTransactionHistory(session.user.id);

  if (!portfolioData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Unable to load portfolio</h1>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-yellow-500 mb-2">My Portfolio</h1>
            <p className="text-gray-400">
              Track your investments and monitor performance
            </p>
          </div>

          {/* Portfolio Dashboard */}
          <PortfolioDashboard
            holdings={portfolioData.holdings}
            totalValue={portfolioData.totalValue}
            totalInvested={portfolioData.totalInvested}
            totalPnL={portfolioData.totalPnL}
            totalPnLPercentage={portfolioData.totalPnLPercentage}
            cashBalance={portfolioData.cashBalance}
            stats={portfolioData.stats}
          />

          {/* Proof of Reserves / On-chain verification (Demo) */}
          <VerifyReservesWidget />

          {/* Transaction History */}
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

