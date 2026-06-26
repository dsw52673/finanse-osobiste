'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Check, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import type { Transaction, Category } from '@/lib/api/types'
import { updateTransactionAction, deleteTransactionAction } from '@/app/actions/transactions'
import { getCleanCategoryName } from '@/lib/category-helpers'
import TransactionRowEdit from './transaction-row-edit'

type TransactionRowProps = {
    transaction: Transaction
    categories: Category[]
    isSelected?: boolean
    onToggleSelect?: () => void
}

export default function TransactionRow({ transaction, categories, isSelected, onToggleSelect }: TransactionRowProps) {
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

    const handleCancelEdit = () => {
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
            const defaultName = type === 'INCOME' ? 'Wynagrodzenie' : 'Inne'
            selectedCatId = categories.find(c => c.name === defaultName)?.id || null
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

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteTransactionAction(transaction.id)
            if (res.success) {
                setIsDeleting(false)
                router.refresh()
            } else alert(res.message)
        })
    }

    const isIncome = transaction.type === 'INCOME'
    const categoryName = transaction.category?.name ? getCleanCategoryName(transaction.category.name) : 'Bez kategorii'
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
                isSelected={isSelected}
                onToggleSelect={onToggleSelect}
            />
        )
    }

    return (
        <tr className={`border-b border-[#202E4C]/25 transition-colors hover:bg-[#0B0F19]/25 ${isDeleting ? 'bg-red-500/5' : ''}`}>
            <td className="p-3">
                <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={onToggleSelect} 
                    className="appearance-none w-[18px] h-[18px] border-2 border-[#202E4C] rounded-md bg-[#161D30]/50 hover:bg-[#161D30] hover:border-[#A3C5FF]/50 checked:bg-[#A3C5FF] checked:border-[#A3C5FF] transition-all cursor-pointer relative flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%230B0F19%22%20stroke-width%3D%223.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%2220%206%209%2017%204%2012%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] before:bg-no-repeat before:bg-center before:bg-[length:10px_10px] before:opacity-0 checked:before:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </td>
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
                            <button type="button" disabled={isPending} onClick={handleDelete} className="p-1.5 bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20 rounded-lg cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                            <button type="button" disabled={isPending} onClick={() => setIsDeleting(false)} className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={() => setIsEditing(true)} className="p-1.5 bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20 rounded-lg cursor-pointer"><Pencil className="h-3.5 w-3.5" /></button>
                            <button type="button" onClick={() => setIsDeleting(true)} className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 rounded-lg cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}
