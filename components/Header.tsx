import Image from "next/image";
import Link from "next/link";
import NavItems from "@/components/NavItems";
import OnchainWalletConnect from "@/components/OnchainWalletConnect";
import PixelCharacter from "@/components/PixelCharacter";
import UserDropdown from "@/components/UserDropdown";
import {searchStocks} from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
    const initialStocks = await searchStocks();

    return (
        <header className="sticky top-0 header z-50">
            <div className="container">
                <div className="flex items-center justify-between px-4 md:px-6 py-4">
                    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0">
                        <PixelCharacter size="md" />
                        <div className="text-lg md:text-xl font-bold text-yellow-500">
                            HODL
                        </div>
                    </Link>
                    
                    <nav className="hidden xl:block flex-1 max-w-2xl mx-8">
                        <NavItems initialStocks={initialStocks} />
                    </nav>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="hidden xl:block">
                            <OnchainWalletConnect />
                        </div>
                        <UserDropdown user={user} initialStocks={initialStocks} />
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Header
