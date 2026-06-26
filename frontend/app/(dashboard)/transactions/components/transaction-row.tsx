'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Check, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import type { Transaction, Category } from '@/lib/api/types'
import { updateTransactionAction, deleteTransactionAction } from '@/app/actions/transactions'
import TransactionRowEdit from './transaction-row-edit'

type TransactionRowProps = {
    transaction: Transaction
    categories: Category[]
}

export default function TransactionRow({ transaction, categories }: TransactionRowProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [amount, setAmount] = useState(() => String(transaction.amount))
    const [type, setType] = useState(transaction.type)
    const [categoryId, setCategoryId] = useState(() => transaction.categoryId ? String(transaction.categoryId) : '')
    const [description, setDescription] = useState(transaction.description || '')
    const [date, setDate] = useState(() => new Date(transaction.date).toISOString().split('T')[0])
    const [error, setError] = useState<string | null>(null)

    function handleCancelEdit() {
        setAmount(String(transaction.amount))
        setType(transaction.type)
        setCategoryId(transaction.categoryId ? String(transaction.categoryId) : '')
        setDescription(transaction.description || '')
        setDate(new Date(transaction.date).toISOString().split('T')[0])
        setError(null)
        setIsEditing(false)
    }

    function handleSave() {
        setError(null)
        const trimmed = amount.trim()
        const parsed = parseFloat(trimmed)
        if (!trimmed) return setError('Kwota jest wymagana')
        if (isNaN(parsed) || parsed <= 0) return setError('Podaj kwotę > 0')
        if (trimmed.split('.')[1]?.length > 2) return setError('Maks 2 miejsca po przecinku')
        if (!date) return setError('Data jest wymagana')

        let selectedCatId = categoryId ? parseInt(categoryId) : null
        if (!selectedCatId) {
            const other = categories.find(c => c.name === 'Inne')
            if (other) selectedCatId = other.id
        }

        startTransition(async () => {
            const res = await updateTransactionAction(transaction.id, {
                amount: parsed,
                type,
                categoryId: selectedCatId,
                description: description.trim() || undefined,
                date: new Date(date).toISOString(),
                currency: 'PLN'
            })
            if (res.success) {
                setIsEditing(false)
                router.refresh()
            } else {
                setError(res.message)
            }
        })
    }

    function handleDelete() {
        startTransition(async () => {
            const res = await deleteTransactionAction(transaction.id)
            if (res.success) {
                setIsDeleting(false)
                router.refresh()
            } else {
                alert(res.message)
            }
        })
    }

    const isIncome = transaction.type === 'INCOME'
    const categoryName = transaction.category?.name ?? 'Bez kategorii'
    const formattedDate = new Date(transaction.date).toLocaleDateString('pl-PL')

    if (isEditing) {
        return (
            <TransactionRowEdit
                type={type}
                setType={setType}
                amount={amount}
                setAmount={setAmount}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                date={date}
                setDate={setDate}
                description={description}
                setDescription={setDescription}
                error={error}
                isPending={isPending}
                categories={categories}
                onSave={handleSave}
                onCancel={handleCancelEdit}
            />
        )
    }

    return (
        <tr className={`border-b border-[#202E4C]/25 transition-colors hover:bg-[#0B0F19]/25 ${isDeleting ? 'bg-red-500/5' : ''}`}>
            <td className="p-3 text-sm font-semibold text-white">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isIncome ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                    {isIncome ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                    {isIncome ? 'Wpływ' : 'Wydatek'}
                </span>
            </td>
            <td className={`p-3 text-sm font-bold ${isIncome ? 'text-green-400' : 'text-white'}`}>
                {isIncome ? '+' : '-'}{transaction.amount.toFixed(2)} PLN
            </td>
            <td className="p-3 text-sm text-[#94A3B8]">{categoryName}</td>
            <td className="p-3 text-sm text-[#94A3B8]">{formattedDate}</td>
            <td className="p-3 text-sm text-[#E2E8F0] max-w-xs truncate">
                {isDeleting ? (
                    <span className="text-red-400 font-medium">Czy na pewno chcesz usunąć tę operację?</span>
                ) : (
                    transaction.description || <span className="text-xs text-[#94A3B8] italic">Brak opisu</span>
                )}
            </td>
            <td className="p-3 text-right">
                <div className="flex items-center justify-end gap-2">
                    {isDeleting ? (
                        <>
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleDelete}
                                className="p-1.5 bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20 rounded-lg transition-all cursor-pointer"
                            >
                                <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => setIsDeleting(false)}
                                className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="p-1.5 bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20 rounded-lg transition-all cursor-pointer"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsDeleting(true)}
                                className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}
