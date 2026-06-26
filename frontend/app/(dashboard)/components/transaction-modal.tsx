'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { createTransactionAction } from '@/app/actions/transactions'
import type { Category } from '@/lib/api/types'
import TransactionForm from './transaction-form'

type TransactionModalProps = {
    isOpen: boolean
    onClose: () => void
    categories: Category[]
}

export default function TransactionModal({ isOpen, onClose, categories }: TransactionModalProps) {
    const router = useRouter()

    if (!isOpen) return null

    async function handleSubmit(formData: {
        amount: number
        type: 'INCOME' | 'EXPENSE'
        categoryId: number | null
        description: string
        date: string
    }) {
        const result = await createTransactionAction({
            amount: formData.amount,
            type: formData.type,
            categoryId: formData.categoryId,
            description: formData.description || undefined,
            date: formData.date,
            currency: 'PLN'
        })

        if (result.success) {
            router.refresh()
            onClose()
        }

        return result
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
                
                <TransactionForm
                    categories={categories}
                    onSubmit={handleSubmit}
                    submitLabel="Dodaj transakcję"
                />
            </div>
        </div>
    )
}
