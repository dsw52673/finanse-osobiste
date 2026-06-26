'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Category, BudgetStatusResponse, AnalyticsByCategoryResponse } from '@/lib/api/types'
import CategoryRow from './category-row'

type CategoryTableProps = {
    categories: Category[]
    onEdit: (category: Category) => void
    onDelete: (id: number) => void
    currentPage: number
    onPageChange: (page: number) => void
    budgetStatus?: BudgetStatusResponse
    analytics?: AnalyticsByCategoryResponse
    onSaveLimit: (categoryId: number, amountStr: string) => void
}

export default function CategoryTable({
    categories,
    onEdit,
    onDelete,
    currentPage,
    onPageChange,
    budgetStatus,
    analytics,
    onSaveLimit
}: CategoryTableProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [editingLimitId, setEditingLimitId] = useState<number | null>(null)
    const [limitValue, setLimitValue] = useState('')

    useEffect(() => {
        setDeletingId(null)
        setEditingLimitId(null)
    }, [currentPage, categories.length])

    const totalPages = Math.ceil(categories.length / 10)
    const displayed = categories.slice((currentPage - 1) * 10, currentPage * 10)

    return (
        <div className="flex flex-col flex-1">
            <div className="overflow-x-auto md:overflow-visible flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#202E4C]/45 bg-[#0B0F19]/40">
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase w-[25%]">Nazwa</th>
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase text-center w-[25%]">Typ</th>
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase w-[25%]">Limit</th>
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase text-right w-[25%]">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayed.map((c) => (
                            <CategoryRow
                                key={c.id}
                                category={c}
                                onEdit={(cat) => {
                                    setEditingLimitId(null)
                                    setDeletingId(null)
                                    onEdit(cat)
                                }}
                                onDelete={onDelete}
                                budgetStatus={budgetStatus}
                                analytics={analytics}
                                onSaveLimit={onSaveLimit}
                                isDeleting={deletingId === c.id}
                                setIsDeleting={(val) => {
                                    if (val) {
                                        setEditingLimitId(null)
                                        setDeletingId(c.id)
                                    } else {
                                        setDeletingId(null)
                                    }
                                }}
                                isEditingLimit={editingLimitId === c.id}
                                setIsEditingLimit={(val) => {
                                    if (val) {
                                        setDeletingId(null)
                                        setEditingLimitId(c.id)
                                        setLimitValue('')
                                    } else {
                                        setEditingLimitId(null)
                                    }
                                }}
                                limitValue={limitValue}
                                setLimitValue={setLimitValue}
                            />
                        ))}
                        {categories.length > 0 && displayed.length < 10 && (
                            Array.from({ length: 10 - displayed.length }).map((_, idx) => (
                                <tr key={`empty-${idx}`} className="border-b border-[#202E4C]/10 last:border-0">
                                    <td colSpan={4} className="p-3 select-none">&nbsp;</td>
                                </tr>
                            ))
                        )}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-sm text-[#94A3B8] italic">
                                    Brak zdefiniowanych kategorii
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="flex items-center justify-center text-[#A3C5FF] hover:text-[#82AFFF] bg-[#202E4C]/40 hover:bg-[#202E4C]/70 disabled:opacity-30 disabled:hover:text-[#A3C5FF] disabled:hover:bg-[#202E4C]/40 rounded-xl p-2.5 transition-all cursor-pointer disabled:cursor-not-allowed border border-[#202E4C]/30"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-semibold text-white">
                        Strona {currentPage} z {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="flex items-center justify-center text-[#A3C5FF] hover:text-[#82AFFF] bg-[#202E4C]/40 hover:bg-[#202E4C]/70 disabled:opacity-30 disabled:hover:text-[#A3C5FF] disabled:hover:bg-[#202E4C]/40 rounded-xl p-2.5 transition-all cursor-pointer disabled:cursor-not-allowed border border-[#202E4C]/30"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    )
}
