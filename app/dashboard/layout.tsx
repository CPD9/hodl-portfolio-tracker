import AIChatOverlay from "@/components/AIChatOverlay";
import DashboardHeader from "@/components/DashboardHeader";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Layout = async ({ children }: { children : React.ReactNode }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if(!session?.user) redirect('/sign-in');

    const user = {
        id: session.user.id,
        name: session.user.name,
        // email excluded; not needed for client components
    }

    // Preload a small set of popular stocks for the header search (non-blocking)
    let initialStocks: StockWithWatchlistStatus[] = [];
    try {
        initialStocks = await searchStocks(''); // returns POPULAR_STOCK_SYMBOLS mapped, cached
    } catch (e) {
        // If fetching fails (e.g., missing token), keep empty to avoid blocking render
        initialStocks = [];
    }

    return (
        <main className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* Shared Gradient Background Effects */}
            <div aria-hidden="true" className="fixed top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-yellow-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
            <div aria-hidden="true" className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
            <div aria-hidden="true" className="fixed h-0 w-[40rem] top-[30%] -left-[5%] shadow-[0_0_900px_20px_#e99b63] rotate-[-30deg] -z-10 pointer-events-none" />

            <DashboardHeader user={user} initialStocks={initialStocks} />

            {/* Add top spacer to avoid content under fixed header */}
            <div className="pt-20 max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-8">
                {children}
            </div>
            
            <AIChatOverlay user={user} />
        </main>
    )
}
export default Layout
