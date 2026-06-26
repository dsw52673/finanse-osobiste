'use client'

import { useState, useEffect } from 'react'
import type { Transaction, Category } from '@/lib/api/types'
import TransactionFilters from './transaction-filters'
import TransactionRow from './transaction-row'
import TransactionPagination from './transaction-pagination'
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/utils/export'
import { Download } from 'lucide-react'

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
    const [priceFrom, setPriceFrom] = useState('')
    const [priceTo, setPriceTo] = useState('')
    const [sortBy, setSortBy] = useState('DATE_DESC')
    const [currentPage, setCurrentPage] = useState(1)

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        setCurrentPage(1)
        setSelectedIds(new Set())
    }, [typeFilter, categoryFilter, dateFrom, dateTo, priceFrom, priceTo, sortBy])

    const filtered = transactions.filter(t => {
        if (typeFilter !== 'ALL' && t.type !== typeFilter) return false
        if (categoryFilter !== 'ALL' && String(t.categoryId) !== categoryFilter) return false

        const tDateStr = new Date(t.date).toISOString().split('T')[0]
        if (dateFrom && tDateStr < dateFrom) return false
        if (dateTo && tDateStr > dateTo) return false

        if (priceFrom && t.amount < parseFloat(priceFrom)) return false
        if (priceTo && t.amount > parseFloat(priceTo)) return false

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

    function handleToggleSelectAll() {
        if (selectedIds.size === displayed.length && displayed.length > 0) {
            setSelectedIds(new Set())
        } else {
            const newSet = new Set<string>()
            displayed.forEach(t => newSet.add(t.id.toString()))
            setSelectedIds(newSet)
        }
    }

    function handleToggleSelect(id: string) {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedIds(newSet)
    }

    function handleExport(format: 'csv' | 'xlsx' | 'pdf') {
        const toExport = selectedIds.size > 0
            ? sorted.filter(t => selectedIds.has(t.id.toString()))
            : sorted

        if (format === 'csv') exportToCSV(toExport, categories)
        else if (format === 'xlsx') exportToExcel(toExport, categories)
        else exportToPDF(toExport, categories)
    }

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
                priceFrom={priceFrom}
                setPriceFrom={setPriceFrom}
                priceTo={priceTo}
                setPriceTo={setPriceTo}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <div className="flex justify-end gap-2 mb-4">
                <button
                    onClick={() => handleExport('csv')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202E4C]/40 hover:bg-[#202E4C]/70 border border-[#202E4C]/50 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                    <Download className="h-3.5 w-3.5" /> CSV
                </button>
                <button
                    onClick={() => handleExport('xlsx')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202E4C]/40 hover:bg-[#202E4C]/70 border border-[#202E4C]/50 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                    <Download className="h-3.5 w-3.5" /> XLSX
                </button>
                <button
                    onClick={() => handleExport('pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202E4C]/40 hover:bg-[#202E4C]/70 border border-[#202E4C]/50 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                    <Download className="h-3.5 w-3.5" /> PDF
                </button>
            </div>

            <div className="bg-[#161D30]/80 border border-[#202E4C]/30 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
                {displayed.length > 0 ? (
                    <div className="overflow-x-auto md:overflow-visible">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#202E4C]/45 bg-[#0B0F19]/40">
                                    <th className="p-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={displayed.length > 0 && selectedIds.size === displayed.length}
                                            onChange={handleToggleSelectAll}
                                            className="appearance-none w-[18px] h-[18px] border-2 border-[#202E4C] rounded-md bg-[#161D30]/50 hover:bg-[#161D30] hover:border-[#A3C5FF]/50 checked:bg-[#A3C5FF] checked:border-[#A3C5FF] transition-all cursor-pointer relative flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%230B0F19%22%20stroke-width%3D%223.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%2220%206%209%2017%204%2012%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] before:bg-no-repeat before:bg-center before:bg-[length:10px_10px] before:opacity-0 checked:before:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </th>
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
                                    <TransactionRow
                                        key={t.id}
                                        transaction={t}
                                        categories={categories}
                                        isSelected={selectedIds.has(t.id.toString())}
                                        onToggleSelect={() => handleToggleSelect(t.id.toString())}
                                    />
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
