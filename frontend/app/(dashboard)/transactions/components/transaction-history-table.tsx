'use client'

import { useState, useEffect } from 'react'
import type { Transaction, Category } from '@/lib/api/types'
import TransactionFilters from './transaction-filters'
import TransactionRow from './transaction-row'
import TransactionPagination from './transaction-pagination'

type TransactionHistoryTableProps = {
    transactions: Transaction[]
    categories: Category[]
}

export default function TransactionHistoryTable({
    transactions,
    categories
}: TransactionHistoryTableProps) {
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [categoryFilter, setCategoryFilter] = useState('ALL')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [sortBy, setSortBy] = useState('DATE_DESC')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        setCurrentPage(1)
    }, [typeFilter, categoryFilter, dateFrom, dateTo, sortBy])

    const filtered = transactions.filter(t => {
        if (typeFilter !== 'ALL' && t.type !== typeFilter) return false
        if (categoryFilter !== 'ALL' && String(t.categoryId) !== categoryFilter) return false
        const tDateStr = new Date(t.date).toISOString().split('T')[0]
        if (dateFrom && tDateStr < dateFrom) return false
        if (dateTo && tDateStr > dateTo) return false
        return true
    })

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'DATE_ASC') return new Date(a.date).getTime() - new Date(b.date).getTime()
        if (sortBy === 'AMOUNT_DESC') return b.amount - a.amount
        if (sortBy === 'AMOUNT_ASC') return a.amount - b.amount
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    const totalPages = Math.ceil(sorted.length / 10)
    const displayed = sorted.slice((currentPage - 1) * 10, currentPage * 10)

    return (
        <div className="w-full flex-1 flex flex-col">
            <TransactionFilters
                categories={categories}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <div className="bg-[#161D30]/80 border border-[#202E4C]/30 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
                {displayed.length > 0 ? (
                    <div className="overflow-x-auto md:overflow-visible">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#202E4C]/45 bg-[#0B0F19]/40">
                                    <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Typ</th>
                                    <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Kwota</th>
                                    <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Kategoria</th>
                                    <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Data</th>
                                    <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Opis</th>
                                    <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase text-right">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.map(t => (
                                    <TransactionRow key={t.id} transaction={t} categories={categories} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center min-h-[300px] p-8 text-center text-sm text-[#94A3B8] italic">
                        Brak transakcji spełniających kryteria filtrowania
                    </div>
                )}
            </div>

            <TransactionPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}
