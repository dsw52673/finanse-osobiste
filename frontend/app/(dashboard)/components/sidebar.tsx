'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Landmark, LayoutDashboard, User, ArrowLeftRight, Tags, LogOut, Plus, Menu, X } from 'lucide-react'
import { logoutAction } from '@/app/actions/logout'
import type { Category } from '@/lib/api/types'
import TransactionModal from './transaction-modal'

type SidebarProps = {
    availableFunds: number
    monthlyExpenses: number
    categories: Category[]
}

export default function Sidebar({ availableFunds, monthlyExpenses, categories }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    async function handleLogout() {
        const result = await logoutAction()
        if (result.success) {
            router.replace('/login')
        }
    }

    const navigationItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Profil', href: '/profile', icon: User },
        { name: 'Transakcje', href: '/transactions', icon: ArrowLeftRight },
        { name: 'Kategorie', href: '/categories', icon: Tags },
    ]

    function renderNavLinks(onItemClick?: () => void) {
        return navigationItems.map((item) => {
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
        })
    }

    return (
        <>
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#161D30] border-b border-[#202E4C]/50 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2">
                    <Landmark className="h-6 w-6 text-[#A3C5FF]" />
                    <span className="font-bold text-white text-lg">Budżet osobisty</span>
                </div>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex bg-[#161D30]">
                    <div className="relative w-full h-full p-6 flex flex-col z-50 animate-fade-in">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2 mb-8">
                            <Landmark className="h-6 w-6 text-[#A3C5FF]" />
                            <span className="font-bold text-white text-lg">Budżet osobisty</span>
                        </div>
                        <nav className="flex flex-col gap-1.5 flex-1">{renderNavLinks(() => setIsMenuOpen(false))}</nav>
                        <div className="mt-auto space-y-4">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false)
                                    setIsModalOpen(true)
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-[#A3C5FF] text-[#0B0F19] font-semibold py-3 px-4 rounded-xl hover:bg-[#82AFFF] transition-colors cursor-pointer"
                            >
                                <Plus className="h-5 w-5" />
                                Dodaj transakcję
                            </button>
                            <div className="p-4 bg-[#0B0F19]/40 border border-[#202E4C]/30 rounded-xl space-y-3">
                                <div>
                                    <div className="text-xs text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Dostępne środki</div>
                                    <div className="text-lg font-bold text-white">{availableFunds.toFixed(2)} PLN</div>
                                </div>
                                <div>
                                    <div className="text-xs text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Wydatki</div>
                                    <div className="text-lg font-bold text-white">{monthlyExpenses.toFixed(2)} PLN</div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E293B] rounded-xl transition-colors font-medium cursor-pointer"
                            >
                                <LogOut className="h-5 w-5" />
                                Wyloguj się
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-[#161D30] border-r border-[#202E4C]/50 p-6 h-screen sticky top-0 flex-shrink-0">
                <div className="flex items-center gap-2 mb-8">
                    <Landmark className="h-6 w-6 text-[#A3C5FF]" />
                    <span className="font-bold text-white text-lg">Budżet osobisty</span>
                </div>
                <nav className="flex flex-col gap-1.5 flex-1">{renderNavLinks()}</nav>
                <div className="mt-auto space-y-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-[#A3C5FF] text-[#0B0F19] font-semibold py-3 px-4 rounded-xl hover:bg-[#82AFFF] transition-colors cursor-pointer"
                    >
                        <Plus className="h-5 w-5" />
                        Dodaj transakcję
                    </button>
                    <div className="p-4 bg-[#0B0F19]/40 border border-[#202E4C]/30 rounded-xl space-y-3">
                        <div>
                            <div className="text-xs text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Dostępne środki</div>
                            <div className="text-lg font-bold text-white">{availableFunds.toFixed(2)} PLN</div>
                        </div>
                        <div>
                            <div className="text-xs text-[#94A3B8] uppercase font-bold tracking-wider mb-1">Wydatki</div>
                            <div className="text-lg font-bold text-white">{monthlyExpenses.toFixed(2)} PLN</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E293B] rounded-xl transition-colors font-medium cursor-pointer"
                    >
                        <LogOut className="h-5 w-5" />
                        Wyloguj się
                    </button>
                </div>
            </aside>

            {isModalOpen && (
                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    categories={categories}
                />
            )}
        </>
    )
}

