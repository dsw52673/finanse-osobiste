'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setOverallBudgetAction } from '@/app/actions/budgets'
import NumberInput from './number-input'

type OverallBudgetModalProps = {
    isOpen: boolean
    onClose: () => void
    currentLimit: number | null
}

export default function OverallBudgetModal({ isOpen, onClose, currentLimit }: OverallBudgetModalProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [amount, setAmount] = useState(() => currentLimit !== null ? String(currentLimit) : '')
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Podaj poprawną kwotę większą od zera')
            return
        }

        startTransition(async () => {
            const result = await setOverallBudgetAction({ amount: parsedAmount })
            if (result.success) {
                router.refresh()
                onClose()
                setAmount('')
            } else {
                setError(result.message)
            }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-[#161D30] border border-[#202E4C]/50 rounded-2xl p-6 shadow-2xl z-10">
                <h4 className="text-base font-bold text-white mb-4">
                    {currentLimit === null ? 'Ustaw limit miesięczny' : 'Zmień limit miesięczny'}
                </h4>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="limitAmount" className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                            Kwota limitu (PLN)
                        </label>
                        <NumberInput
                            id="limitAmount"
                            min={0.01}
                            value={amount}
                            onChange={setAmount}
                            placeholder="np. 4000"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-[#0B0F19]/40 border border-[#202E4C]/30 text-white py-2 rounded-xl text-xs font-semibold hover:bg-[#0B0F19]/60 transition-colors cursor-pointer"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-[#A3C5FF] text-[#0B0F19] py-2 rounded-xl text-xs font-semibold hover:bg-[#82AFFF] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {isPending ? 'Zapisywanie...' : 'Zapisz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
