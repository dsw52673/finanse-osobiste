'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, User, ArrowLeftRight, Tags, TrendingUp } from 'lucide-react'

type SidebarNavigationProps = {
    onItemClick?: () => void
}

const navigationItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Profil', href: '/profile', icon: User },
    { name: 'Transakcje', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Kategorie', href: '/categories', icon: Tags },
    { name: 'Analizy', href: '/analytics', icon: TrendingUp }
]

export default function SidebarNavigation({ onItemClick }: SidebarNavigationProps) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col gap-1.5 flex-1">
            {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={onItemClick}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer ${
                            isActive
                                ? 'bg-[#242F4D] text-[#E2E8F0] border-l-4 border-[#A3C5FF]'
                                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#E2E8F0]'
                        }`}
                    >
                        <Icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                )
            })}
        </div>
    )
}
