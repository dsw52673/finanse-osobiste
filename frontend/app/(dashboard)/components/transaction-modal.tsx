'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { createTransactionAction } from '@/app/actions/transactions'
import type { Category } from '@/lib/api/types'
import NumberInput from './number-input'
import CategorySelect from './category-select'

type TransactionModalProps = {
    isOpen: boolean
    onClose: () => void
    categories: Category[]
}

export default function TransactionModal({ isOpen, onClose, categories }: TransactionModalProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [amount, setAmount] = useState('')
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
    const [categoryId, setCategoryId] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const filteredCategories = categories.filter(category => {
        if (type === 'EXPENSE') {
            return ['Inne', 'Jedzenie', 'Paliwo', 'Subskrypcje', 'Czynsz', 'Rozrywka'].includes(category.name)
        } else {
            return ['Inne', 'Wynagrodzenie'].includes(category.name)
        }
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Podaj poprawną kwotę większą od zera')
            return
        }

        if (!date) {
            setError('Data transakcji jest wymagana')
            return
        }

        startTransition(async () => {
            const selectedCategoryId = categoryId ? parseInt(categoryId) : undefined
            const result = await createTransactionAction({
                amount: parsedAmount,
                type,
                categoryId: selectedCategoryId || null,
                description: description.trim() || undefined,
                date: new Date(date).toISOString(),
                currency: 'PLN',
            })

            if (result.success) {
                router.refresh()
                onClose()
            } else {
                setError(result.message)
            }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#161D30] border border-[#202E4C]/50 rounded-2xl p-6 shadow-2xl z-10 animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer"
                >
                    <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-white mb-6">Dodaj nową transakcję</h2>
                
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
                        <NumberInput
                            id="amount"
                            min={0.01}
                            value={amount}
                            onChange={setAmount}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Kategoria</label>
                        <CategorySelect
                            value={categoryId}
                            onChange={setCategoryId}
                            categories={filteredCategories}
                            placeholder="Wybierz kategorię..."
                        />
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
                        {isPending ? 'Zapisywanie...' : 'Dodaj transakcję'}
                    </button>
                </form>
            </div>
        </div>
    )
}

