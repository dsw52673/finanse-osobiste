'use client'

import { useState, useTransition } from 'react'
import type { Category } from '@/lib/api/types'
import NumberInput from './number-input'
import CategorySelect from './category-select'

type TransactionFormProps = {
    categories: Category[]
    initialData?: {
        amount: number
        type: 'INCOME' | 'EXPENSE'
        categoryId?: number | null
        description?: string
        date: string
    }
    onSubmit: (data: {
        amount: number
        type: 'INCOME' | 'EXPENSE'
        categoryId: number | null
        description: string
        date: string
    }) => Promise<{ success: boolean; message?: string }>
    submitLabel?: string
}

export default function TransactionForm({
    categories,
    initialData,
    onSubmit,
    submitLabel = 'Zapisz'
}: TransactionFormProps) {
    const [isPending, startTransition] = useTransition()
    const [amount, setAmount] = useState(() => initialData?.amount ? String(initialData.amount) : '')
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>(() => initialData?.type ?? 'EXPENSE')
    const [categoryId, setCategoryId] = useState(() => initialData?.categoryId ? String(initialData.categoryId) : '')
    const [description, setDescription] = useState(() => initialData?.description ?? '')
    const [date, setDate] = useState(() => initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
    const [error, setError] = useState<string | null>(null)

    const filteredCategories = categories.filter(c => 
        type === 'EXPENSE'
            ? ['Inne', 'Jedzenie', 'Paliwo', 'Subskrypcje', 'Czynsz', 'Rozrywka'].includes(c.name)
            : ['Inne', 'Wynagrodzenie'].includes(c.name)
    )

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        const trimmedAmount = amount.trim()
        if (!trimmedAmount) {
            setError('Podaj kwotę transakcji')
            return
        }
        const parsedAmount = parseFloat(trimmedAmount)
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Podaj poprawną kwotę większą od zera')
            return
        }
        const decimalParts = trimmedAmount.split('.')
        if (decimalParts[1] && decimalParts[1].length > 2) {
            setError('Kwota może mieć maksymalnie dwa miejsca po przecinku')
            return
        }
        if (!date) {
            setError('Data transakcji jest wymagana')
            return
        }
        let selectedCategoryId = categoryId ? parseInt(categoryId) : null
        if (!selectedCategoryId) {
            const otherCategory = categories.find(c => c.name === 'Inne')
            if (otherCategory) {
                selectedCategoryId = otherCategory.id
            }
        }
        startTransition(async () => {
            const result = await onSubmit({
                amount: parsedAmount,
                type,
                categoryId: selectedCategoryId,
                description: description.trim(),
                date: new Date(date).toISOString()
            })
            if (result && !result.success && result.message) {
                setError(result.message)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Typ transakcji</label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setType('INCOME')
                            setCategoryId('')
                        }}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            type === 'INCOME'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/45'
                                : 'bg-[#0B0F19]/40 text-[#94A3B8] border border-[#202E4C]/30 hover:bg-[#0B0F19]/60'
                        }`}
                    >
                        Wpływ
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setType('EXPENSE')
                            setCategoryId('')
                        }}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            type === 'EXPENSE'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/45'
                                : 'bg-[#0B0F19]/40 text-[#94A3B8] border border-[#202E4C]/30 hover:bg-[#0B0F19]/60'
                        }`}
                    >
                        Wydatek
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-[#94A3B8] mb-1.5">Kwota (PLN)</label>
                <NumberInput id="amount" min={0.01} value={amount} onChange={setAmount} placeholder="0.00" />
            </div>
            <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Kategoria</label>
                <CategorySelect value={categoryId} onChange={setCategoryId} categories={filteredCategories} placeholder="Wybierz kategorię..." />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-[#94A3B8] mb-1.5">Data</label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="w-full bg-[#0B0F19]/40 border border-[#202E4C]/30 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#A3C5FF] transition-colors cursor-pointer"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#94A3B8] mb-1.5">Opis (opcjonalnie)</label>
                <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0B0F19]/40 border border-[#202E4C]/30 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#A3C5FF] transition-colors"
                />
            </div>
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3">
                    {error}
                </div>
            )}
            <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center bg-[#A3C5FF] text-[#0B0F19] font-semibold py-3 px-4 rounded-xl hover:bg-[#82AFFF] transition-colors cursor-pointer disabled:cursor-not-allowed mt-2 disabled:opacity-50"
            >
                {isPending ? 'Zapisywanie...' : submitLabel}
            </button>
        </form>
    )
}
