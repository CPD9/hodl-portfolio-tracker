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
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                    <PixelCharacter size="md" />
                    <div className="text-2xl font-bold text-yellow-500 cursor-pointer">
                        HODL
                    </div>
                </Link>
                <nav className="hidden sm:block">
                    <NavItems initialStocks={initialStocks} />
                </nav>

                <div className="flex items-center space-x-4">
                    <OnchainWalletConnect />
                    <UserDropdown user={user} initialStocks={initialStocks} />
                </div>
            </div>
        </header>
    )
}
export default Header
