'use client'

import { Check, X } from 'lucide-react'
import type { Category } from '@/lib/api/types'
import CustomSelect from '../../components/custom-select'

import NumberInput from '../../components/number-input'

type TransactionRowEditProps = {
    type: 'INCOME' | 'EXPENSE'
    setType: (val: 'INCOME' | 'EXPENSE') => void
    amount: string
    setAmount: (val: string) => void
    categoryId: string
    setCategoryId: (val: string) => void
    date: string
    setDate: (val: string) => void
    description: string
    setDescription: (val: string) => void
    error: string | null
    isPending: boolean
    categories: Category[]
    onSave: () => void
    onCancel: () => void
}

export default function TransactionRowEdit({
    type,
    setType,
    amount,
    setAmount,
    categoryId,
    setCategoryId,
    date,
    setDate,
    description,
    setDescription,
    error,
    isPending,
    categories,
    onSave,
    onCancel
}: TransactionRowEditProps) {
    const typeOptions = [
        { value: 'INCOME', label: 'Wpływ' },
        { value: 'EXPENSE', label: 'Wydatek' }
    ]

    const categoryOptions = [
        { value: '', label: 'Bez kategorii' },
        ...categories.map((c) => ({ value: String(c.id), label: c.name }))
    ]

    return (
        <tr className="border-b border-[#202E4C]/25 bg-[#0B0F19]/40">
            <td className="p-3 min-w-[120px]">
                <CustomSelect
                    value={type}
                    onChange={(val) => setType(val as 'INCOME' | 'EXPENSE')}
                    options={typeOptions}
                    buttonClassName="!py-1 !px-2 bg-[#161D30] border-[#202E4C]/45 rounded-lg text-xs h-[30px]"
                />
            </td>
            <td className="p-3">
                <div className="w-[110px]">
                    <NumberInput
                        value={amount}
                        onChange={setAmount}
                        step={0.01}
                        min={0.01}
                        placeholder="0.00"
                        className="!bg-[#161D30] !border-[#202E4C]/45 !rounded-lg !pl-2 !pr-10 !py-1 !text-xs !h-[30px]"
                    />
                </div>
            </td>
            <td className="p-3 min-w-[180px]">
                <CustomSelect
                    value={categoryId}
                    onChange={setCategoryId}
                    options={categoryOptions}
                    placeholder="Bez kategorii"
                    buttonClassName="!py-1 !px-2 bg-[#161D30] border-[#202E4C]/45 rounded-lg text-xs h-[30px]"
                />
            </td>
            <td className="p-3">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="bg-[#161D30] border border-[#202E4C]/45 rounded-lg px-2 py-1 text-white outline-none focus:border-[#A3C5FF] text-xs cursor-pointer h-[30px]"
                />
            </td>
            <td className="p-3">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full max-w-xs bg-[#161D30] border border-[#202E4C]/45 rounded-lg px-2 py-1.5 text-white outline-none focus:border-[#A3C5FF] text-xs h-[30px]"
                />
                {error && <div className="text-[10px] text-red-400 mt-1 font-medium">{error}</div>}
            </td>
            <td className="p-3 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={onSave}
                        className="p-1.5 bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/20 rounded-lg transition-all cursor-pointer"
                    >
                        <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={onCancel}
                        className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    )
}
