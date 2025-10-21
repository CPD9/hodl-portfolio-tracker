'use client'

import {NAV_ITEMS} from "@/lib/constants";
import Link from "next/link";
import {usePathname} from "next/navigation";
import SearchCommand from "@/components/SearchCommand";

const NavItems = ({initialStocks}: { initialStocks: StockWithWatchlistStatus[]}) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';

        return pathname.startsWith(path);
    }

    return (
        <ul className="flex flex-col sm:flex-row items-start sm:items-center p-2 gap-2 sm:gap-6 font-medium">
            {NAV_ITEMS.map(({ href, label }) => {
                if(href === '/search') return (
                    <li key="search-trigger" className="w-full sm:w-auto">
                        <SearchCommand
                            renderAs="text"
                            label="Search"
                            initialStocks={initialStocks}
                        />
                    </li>
                )

                return <li key={href} className="w-full sm:w-auto">
                    <Link 
                        href={href} 
                        className={`block py-1 hover:text-yellow-500 transition-colors ${
                            isActive(href) ? 'text-yellow-400 font-semibold' : 'text-gray-300'
                        }`}
                    >
                        {label}
                    </Link>
                </li>
            })}
        </ul>
    )
}
export default NavItems
