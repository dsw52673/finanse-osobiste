'use client'

import Link from 'next/link'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import type { Transaction } from '@/lib/api/types'

import { getCleanCategoryName } from '@/lib/category-helpers'

type RecentTransactionsProps = {
    transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const sorted = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4)

    const hasTransactions = sorted.length > 0

    return (
        <div className="bg-[#161D30] border border-[#202E4C]/50 rounded-3xl p-6 w-full flex flex-col justify-between min-h-[250px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-lg">Ostatnie Transakcje</h3>
                <Link
                    href="/transactions"
                    className="text-xs font-semibold text-[#A3C5FF] hover:underline cursor-pointer"
                >
                    Pokaż wszystkie
                </Link>
            </div>

            {!hasTransactions ? (
                <div className="flex-1 flex items-center justify-center text-center py-8">
                    <p className="text-xs text-[#94A3B8] max-w-[200px] leading-relaxed">
                        Brak zarejestrowanych transakcji.
                    </p>
                </div>
            ) : (
                <div className="flex-1 space-y-3">
                    {sorted.map((transaction) => {
                        const isIncome = transaction.type === 'INCOME'
                        const amountColor = isIncome ? 'text-green-400' : 'text-white'
                        const Icon = isIncome ? ArrowUpRight : ArrowDownLeft
                        const iconBg = isIncome ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'

                        const categoryName = transaction.category?.name ? getCleanCategoryName(transaction.category.name) : 'Bez kategorii'
                        const displayTitle = transaction.description || categoryName
                        const formattedDate = new Date(transaction.date).toLocaleDateString('pl-PL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })

                        return (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0F19]/35 border border-[#202E4C]/25 hover:border-[#202E4C]/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${iconBg}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white truncate max-w-[150px] sm:max-w-[250px]">
                                            {displayTitle}
                                        </h4>
                                        <span className="text-[10px] text-[#94A3B8] font-medium">
                                            {categoryName} • {formattedDate}
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${amountColor}`}>
                                    {isIncome ? '+' : '-'}
                                    {transaction.amount.toFixed(2)} PLN
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
