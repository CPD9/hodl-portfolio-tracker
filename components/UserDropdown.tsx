'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import NavItems from "@/components/NavItems";
import OnchainWalletConnect from "@/components/OnchainWalletConnect";
import {signOut} from "@/lib/actions/auth.actions";
import {useRouter} from "next/navigation";
import { useState } from "react";

const UserDropdown = ({ user, initialStocks }: {user: User, initialStocks: StockWithWatchlistStatus[]}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    }

    const handleNavClick = () => {
        setOpen(false);
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 md:gap-3 text-gray-400 hover:text-yellow-500">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                            {user.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className='text-base font-medium text-gray-400'>
                            {user.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                sideOffset={12}
                className="z-[70] mt-2 bg-gray-900 text-gray-200 border border-gray-800 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-none max-h-[70vh] overflow-y-auto scrollbar-black w-[16rem] sm:w-[18rem] md:w-[20rem]"
            >
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-1 md:py-2">
                        <Avatar className="h-8 w-8 md:h-10 md:w-10">
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className='text-sm md:text-base font-medium text-gray-400'>
                                {user.name}
                            </span>
                            <span className="text-xs md:text-sm text-gray-500">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600"/>
                
                {/* Navigation - Only on mobile/tablet */}
                <div className="lg:hidden">
                    <nav>
                        <NavItems initialStocks={initialStocks} vertical={true} onNavigate={handleNavClick} />
                    </nav>
                    <DropdownMenuSeparator className="bg-gray-600 my-2"/>
                </div>
                
                {/* Wallet Connect - Only on mobile/tablet */}
                <div className="lg:hidden p-2">
                    <OnchainWalletConnect />
                </div>
                <DropdownMenuSeparator className="lg:hidden bg-gray-600"/>
                
                {/* Logout */}
                <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserDropdown
