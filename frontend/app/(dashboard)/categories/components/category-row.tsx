'use client'

import { Pencil, Trash2, Check, X, Target } from 'lucide-react'
import type { Category, BudgetStatusResponse, AnalyticsByCategoryResponse } from '@/lib/api/types'
import { getCleanCategoryName, getCategoryType } from '@/lib/category-helpers'
import { SYSTEM_CATEGORIES } from './utils'

type CategoryRowProps = {
    category: Category
    onEdit: (category: Category) => void
    onDelete: (id: number) => void
    budgetStatus?: BudgetStatusResponse
    analytics?: AnalyticsByCategoryResponse
    onSaveLimit: (categoryId: number, amountStr: string) => void
    isDeleting: boolean
    setIsDeleting: (val: boolean) => void
    isEditingLimit: boolean
    setIsEditingLimit: (val: boolean) => void
    limitValue: string
    setLimitValue: (val: string) => void
}

function getSpentColor(spentVal: number, limitVal: number | null) {
    if (!limitVal) return 'text-[#E2E8F0] font-medium'
    const pct = (spentVal / limitVal) * 100
    if (pct >= 95) return 'text-red-400 font-bold'
    if (pct >= 80) return 'text-yellow-400 font-bold'
    return 'text-white font-medium'
}

export default function CategoryRow({
    category,
    onEdit,
    onDelete,
    budgetStatus,
    analytics,
    onSaveLimit,
    isDeleting,
    setIsDeleting,
    isEditingLimit,
    setIsEditingLimit,
    limitValue,
    setLimitValue
}: CategoryRowProps) {
    const isSystem = category.isSystem || SYSTEM_CATEGORIES.includes(category.name)
    const isIncomeCat = getCategoryType(category) === 'INCOME'
    const status = budgetStatus?.categories.find((bc) => bc.categoryId === category.id)
    const limit = status ? status.limit : null
    const spent = status ? status.spent : (analytics?.data.find((item) => item.name === category.name)?.value ?? 0)

    return (
        <tr className={`border-b border-[#202E4C]/25 hover:bg-[#0B0F19]/25 transition-colors ${isDeleting ? 'bg-red-500/5' : ''}`}>
            <td className="p-3 text-sm text-[#E2E8F0] font-medium">
                {getCleanCategoryName(category.name)}
                {isDeleting && (
                    <span className="text-red-400 text-xs ml-2 font-medium">
                        (Czy usunąć?)
                    </span>
                )}
            </td>
            <td className="p-3 text-sm text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isIncomeCat ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                    {isIncomeCat ? 'Wpływ' : 'Wydatek'}
                </span>
            </td>
            <td className="p-3 text-sm text-[#E2E8F0]">
                {isEditingLimit ? (
                    <div className="flex items-center gap-1.5">
                        <input
                            type="text"
                            value={limitValue}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9.]/g, '')
                                const parts = val.split('.')
                                setLimitValue(parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : val)
                            }}
                            placeholder="np. 350"
                            className="w-20 bg-[#0B0F19]/60 border border-[#202E4C]/45 rounded-lg px-2 py-0.5 text-white outline-none focus:border-[#A3C5FF] transition-colors text-xs h-[28px]"
                            autoFocus
                        />
                        <button type="button" onClick={() => { onSaveLimit(category.id, limitValue); setIsEditingLimit(false) }} className="p-1 bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20 rounded-md cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => setIsEditingLimit(false)} className="p-1 bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 rounded-md cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-[#E2E8F0]">
                            {isIncomeCat ? (
                                <span className="text-[#94A3B8] italic text-xs">—</span>
                            ) : limit !== null ? (
                                <span>
                                    <span className={getSpentColor(spent, limit)}>{spent.toFixed(2)}</span>
                                    <span className="text-[#94A3B8] mx-1">/</span>
                                    <span className="font-semibold text-white">{limit.toFixed(2)} PLN</span>
                                </span>
                            ) : (
                                <span className="text-[#94A3B8] italic text-xs">brak</span>
                            )}
                        </span>
                    </div>
                )}
            </td>
            <td className="p-3 text-right">
                <div className="flex items-center justify-end gap-2">
                    {isDeleting ? (
                        <>
                            <button type="button" onClick={() => { onDelete(category.id); setIsDeleting(false) }} className="p-1.5 bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20 rounded-lg cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                            <button type="button" onClick={() => setIsDeleting(false)} className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                        </>
                    ) : (
                        <>
                            {!isIncomeCat && (
                                <button type="button" onClick={() => { setIsEditingLimit(true); setLimitValue('') }} className="p-1.5 bg-[#202E4C]/40 text-[#A3C5FF] hover:bg-[#202E4C]/70 rounded-lg border border-[#202E4C]/30 cursor-pointer" title="Ustaw limit"><Target className="h-3.5 w-3.5" /></button>
                            )}
                            {!isSystem && (
                                <>
                                    <button type="button" onClick={() => onEdit(category)} className="p-1.5 bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20 rounded-lg cursor-pointer"><Pencil className="h-3.5 w-3.5" /></button>
                                    <button type="button" onClick={() => setIsDeleting(true)} className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 rounded-lg cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}
