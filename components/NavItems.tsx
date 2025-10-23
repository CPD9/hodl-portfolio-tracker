'use client'

import Link from "next/link";
import {NAV_ITEMS} from "@/lib/constants";
import SearchCommand from "@/components/SearchCommand";
import {usePathname} from "next/navigation";

const NavItems = ({initialStocks, vertical = false, onNavigate}: { initialStocks: StockWithWatchlistStatus[], vertical?: boolean, onNavigate?: () => void }) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';

        return pathname.startsWith(path);
    }

    const items = pathname === '/'
        ? [
            ...NAV_ITEMS,
            { href: '/#how-it-works', label: 'How it works' },
            { href: '/#competitive-landscape', label: 'Competitive' },
            { href: '/#pricing', label: 'Pricing' },
            { href: '/#market-opportunity', label: 'Opportunity' },
          ]
        : NAV_ITEMS;

    return (
        <ul className={`flex ${vertical ? 'flex-col' : 'flex-col sm:flex-row'} p-2 gap-3 ${vertical ? 'gap-3' : 'sm:gap-10'} font-medium`}>
            {items.map(({ href, label }) => {
                if(href === '/search') return (
                    <li key="search-trigger">
                        <SearchCommand
                            renderAs="text"
                            label="Search"
                            initialStocks={initialStocks}
                        />
                    </li>
                )

                return <li key={href} className={vertical ? 'w-full' : ''}>
                    <Link 
                        href={href}
                        onClick={onNavigate}
                        className={`${vertical ? 'block py-2 px-2 rounded hover:bg-gray-700' : ''} hover:text-yellow-500 transition-colors ${
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
