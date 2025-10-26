'use client'

import Link from "next/link";
import {NAV_ITEMS} from "@/lib/constants";
import SearchCommand from "@/components/SearchCommand";
import {usePathname} from "next/navigation";

const NavItems = ({initialStocks, vertical = false, onNavigate, dense = false}: { initialStocks: StockWithWatchlistStatus[], vertical?: boolean, onNavigate?: () => void, dense?: boolean }) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';

        return pathname.startsWith(path);
    }

    return (
        <ul className={`flex ${vertical ? 'flex-col' : 'flex-col sm:flex-row'} p-2 gap-3 ${vertical ? 'gap-3' : (dense ? 'sm:gap-5' : 'sm:gap-10')} font-medium ${dense ? 'text-sm' : ''}`}>
            {NAV_ITEMS.map(({ href, label }) => {
                if(href === '/search') return (
                    <li key="search-trigger" className={vertical ? 'w-full' : ''}>
                        <span className={`${vertical ? 'block py-2 px-2 rounded text-center hover:underline underline-offset-4 decoration-yellow-500' : 'hover:underline underline-offset-4 decoration-yellow-500/70 whitespace-nowrap'} hover:text-yellow-500 transition-colors cursor-pointer`}>
                            <SearchCommand
                                renderAs="text"
                                label="Search"
                                initialStocks={initialStocks}
                            />
                        </span>
                    </li>
                )

                return <li key={href} className={vertical ? 'w-full' : ''}>
                    <Link 
                        href={href}
                        onClick={onNavigate}
                        className={`${vertical ? 'block py-2 px-2 rounded text-center hover:underline underline-offset-4 decoration-yellow-500' : 'hover:underline underline-offset-4 decoration-yellow-500/70 whitespace-nowrap'} hover:text-yellow-500 transition-colors ${
                            isActive(href) ? 'text-gray-100' : ''
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
