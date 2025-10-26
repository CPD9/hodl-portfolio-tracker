import Image from "next/image";
import Link from "next/link";
import NavItems from "@/components/NavItems";
import PixelCharacter from "@/components/PixelCharacter";
import UserDropdown from "@/components/UserDropdown";
import {searchStocks} from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
    const initialStocks = await searchStocks();

    return (
        <header className="sticky top-0 header z-50">
            <div className="container header-wrapper">
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <PixelCharacter size="md" />
                    <div className="text-xl md:text-2xl font-bold text-yellow-500">
                        HODL
                    </div>
                </Link>
                
                <nav className="hidden lg:block">
                    <NavItems initialStocks={initialStocks} />
                </nav>

                <div className="flex items-center gap-4">
                    <UserDropdown user={user} initialStocks={initialStocks} />
                </div>
            </div>
        </header>
    )
}
export default Header
