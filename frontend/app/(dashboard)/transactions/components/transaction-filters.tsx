'use client'

import type { Category } from '@/lib/api/types'
import CustomSelect from '../../components/custom-select'
import { RotateCcw } from 'lucide-react'

type TransactionFiltersProps = {
    categories: Category[]
    typeFilter: string
    setTypeFilter: (value: string) => void
    categoryFilter: string
    setCategoryFilter: (value: string) => void
    dateFrom: string
    setDateFrom: (value: string) => void
    dateTo: string
    setDateTo: (value: string) => void
    priceFrom: string
    setPriceFrom: (value: string) => void
    priceTo: string
    setPriceTo: (value: string) => void
    sortBy: string
    setSortBy: (value: string) => void
}

export default function TransactionFilters({
    categories,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    priceFrom,
    setPriceFrom,
    priceTo,
    setPriceTo,
    sortBy,
    setSortBy
}: TransactionFiltersProps) {
    const typeOptions = [
        { value: 'ALL', label: 'Wszystkie' },
        { value: 'INCOME', label: 'Wpływy' },
        { value: 'EXPENSE', label: 'Wydatki' }
    ]

    const categoryOptions = [
        { value: 'ALL', label: 'Wszystkie' },
        ...categories.map((c) => ({ value: String(c.id), label: c.name }))
    ]

    const sortOptions = [
        { value: 'DATE_DESC', label: 'Najnowsze' },
        { value: 'DATE_ASC', label: 'Najstarsze' },
        { value: 'AMOUNT_DESC', label: 'Kwota: od najwyższej' },
        { value: 'AMOUNT_ASC', label: 'Kwota: od najniższej' }
    ]

    const isFilterActive =
        typeFilter !== 'ALL' ||
        categoryFilter !== 'ALL' ||
        dateFrom !== '' ||
        dateTo !== '' ||
        priceFrom !== '' ||
        priceTo !== '' ||
        sortBy !== 'DATE_DESC'

    function handleClear() {
        setTypeFilter('ALL')
        setCategoryFilter('ALL')
        setDateFrom('')
        setDateTo('')
        setPriceFrom('')
        setPriceTo('')
        setSortBy('DATE_DESC')
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#161D30]/80 border border-[#202E4C]/30 p-5 rounded-2xl mb-6">
            <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Typ</label>
                <CustomSelect
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={typeOptions}
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Kategoria</label>
                <CustomSelect
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    options={categoryOptions}
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Od daty</label>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="w-full bg-[#0B0F19]/60 border border-[#202E4C]/45 rounded-xl px-3 py-2 text-white outline-none focus:border-[#A3C5FF] transition-colors text-sm cursor-pointer text-left h-[38px]"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Do daty</label>
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="w-full bg-[#0B0F19]/60 border border-[#202E4C]/45 rounded-xl px-3 py-2 text-white outline-none focus:border-[#A3C5FF] transition-colors text-sm cursor-pointer text-left h-[38px]"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Kwota od</label>
                <input
                    type="number"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="w-full bg-[#0B0F19]/60 border border-[#202E4C]/45 rounded-xl px-3 py-2 text-white outline-none focus:border-[#A3C5FF] transition-colors text-sm text-left h-[38px]"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Kwota do</label>
                <input
                    type="number"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="w-full bg-[#0B0F19]/60 border border-[#202E4C]/45 rounded-xl px-3 py-2 text-white outline-none focus:border-[#A3C5FF] transition-colors text-sm text-left h-[38px]"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Sortowanie</label>
                <CustomSelect
                    value={sortBy}
                    onChange={setSortBy}
                    options={sortOptions}
                />
            </div>
            <div className="flex flex-col justify-end">
                <button
                    type="button"
                    disabled={!isFilterActive}
                    onClick={handleClear}
                    className={`w-full border text-xs font-semibold transition-all h-[38px] flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 cursor-pointer ${
                        isFilterActive
                            ? 'bg-[#202E4C]/40 hover:bg-[#202E4C]/70 border-[#202E4C]/50 text-white hover:shadow-lg'
                            : 'bg-[#202E4C]/10 border-[#202E4C]/20 text-[#94A3B8]/30 cursor-not-allowed'
                    }`}
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Wyczyść
                </button>
            </div>
        </div>
    )
}

