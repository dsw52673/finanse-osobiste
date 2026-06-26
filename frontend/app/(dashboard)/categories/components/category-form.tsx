'use client'

import { Plus, Check, X } from 'lucide-react'
import type { Category } from '@/lib/api/types'

type CategoryFormProps = {
    name: string
    setName: (name: string) => void
    editingCategory: Category | null
    error: string | null
    isPending: boolean
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
    categoryType: 'EXPENSE' | 'INCOME'
    setCategoryType: (type: 'EXPENSE' | 'INCOME') => void
}

export default function CategoryForm({
    name,
    setName,
    editingCategory,
    error,
    isPending,
    onSubmit,
    onCancel,
    categoryType,
    setCategoryType
}: CategoryFormProps) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-3 mb-6 bg-[#0B0F19]/30 border border-[#202E4C]/20 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="w-full sm:w-48">
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                        Typ kategorii
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                        <button
                            type="button"
                            onClick={() => setCategoryType('EXPENSE')}
                            className={`py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer h-[38px] ${
                                categoryType === 'EXPENSE'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/45'
                                    : 'bg-[#0B0F19]/40 text-[#94A3B8] border border-[#202E4C]/30 hover:bg-[#0B0F19]/60'
                            }`}
                        >
                            Wydatek
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategoryType('INCOME')}
                            className={`py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer h-[38px] ${
                                categoryType === 'INCOME'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/45'
                                    : 'bg-[#0B0F19]/40 text-[#94A3B8] border border-[#202E4C]/30 hover:bg-[#0B0F19]/60'
                            }`}
                        >
                            Wpływ
                        </button>
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <label htmlFor="categoryName" className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                        {editingCategory ? 'Edytuj nazwę kategorii' : 'Nowa kategoria'}
                    </label>
                    <input
                        id="categoryName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="np. Zdrowie, Podróże..."
                        className="w-full bg-[#0B0F19]/60 border border-[#202E4C]/45 rounded-xl px-3 py-2 text-white outline-none focus:border-[#A3C5FF] transition-colors text-sm h-[38px]"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    {editingCategory ? (
                        <>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#A3C5FF] text-[#0B0F19] font-semibold py-2 px-4 rounded-xl hover:bg-[#82AFFF] transition-colors cursor-pointer text-sm h-[38px] disabled:opacity-50 whitespace-nowrap"
                            >
                                <Check className="h-4 w-4" />
                                Zapisz
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 font-semibold py-2 px-4 rounded-xl transition-colors cursor-pointer text-sm h-[38px]"
                            >
                                <X className="h-4 w-4" />
                                Anuluj
                            </button>
                        </>
                    ) : (
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#A3C5FF] text-[#0B0F19] font-semibold py-2 px-4 rounded-xl hover:bg-[#82AFFF] transition-colors cursor-pointer text-sm h-[38px] whitespace-nowrap font-medium"
                        >
                            <Plus className="h-4 w-4" />
                            Dodaj kategorię
                        </button>
                    )}
                </div>
            </div>
            {error && <div className="text-xs text-red-400 font-medium">{error}</div>}
        </form>
    )
}
