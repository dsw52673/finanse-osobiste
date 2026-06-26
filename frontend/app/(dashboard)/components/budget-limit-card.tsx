'use client'

import { useState } from 'react'
import { PiggyBank, Pencil } from 'lucide-react'
import type { BudgetStatusResponse } from '@/lib/api/types'
import OverallBudgetModal from './overall-budget-modal'
import CategoryBudgetsSlider from './category-budgets-slider'

type BudgetLimitCardProps = {
    budgetStatus: BudgetStatusResponse
}

export default function BudgetLimitCard({ budgetStatus }: BudgetLimitCardProps) {
    const [isFormOpen, setIsFormOpen] = useState(false)

    const overallBudget = budgetStatus.overall
    const limit = overallBudget.limit
    const spent = overallBudget.spent
    const remaining = overallBudget.remaining ?? 0
    const percentUsed = overallBudget.percentUsed ?? 0

    const percentRemaining = limit && limit > 0 ? Math.max(0, (remaining / limit) * 100) : 0

    function getProgressBarColor(percent: number) {
        if (percent >= 90) return 'bg-red-500 shadow-md shadow-red-500/20'
        if (percent >= 70) return 'bg-yellow-500 shadow-md shadow-yellow-500/20'
        return 'bg-[#A3C5FF] shadow-md shadow-[#A3C5FF]/20'
    }

    return (
        <div className="bg-[#161D30] border border-[#202E4C]/50 rounded-3xl p-6 flex flex-col justify-between h-full min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">Limit i Budżet</h3>
                {limit !== null && (
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="p-2 text-[#94A3B8] hover:text-[#E2E8F0] bg-[#0B0F19]/40 border border-[#202E4C]/30 hover:border-[#202E4C]/60 rounded-xl transition-colors cursor-pointer"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                )}
            </div>

            {limit === null ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#202E4C]/30 flex items-center justify-center text-[#94A3B8]">
                        <PiggyBank className="h-6 w-6 text-[#A3C5FF]" />
                    </div>
                    <div>
                        <p className="font-bold text-[#E2E8F0] text-sm">Brak ustalonego limitu</p>
                        <p className="text-xs text-[#94A3B8] max-w-[220px] mt-1">
                            Ustaw swój miesięczny budżet, aby móc śledzić statystyki i ostrzeżenia.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-[#A3C5FF] text-[#0B0F19] text-xs font-semibold py-2.5 px-6 rounded-xl hover:bg-[#82AFFF] transition-colors cursor-pointer"
                    >
                        Ustaw limit
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                            <span className="text-2xl font-bold text-white">
                                {spent.toFixed(2)}
                                <span className="text-sm font-semibold text-[#94A3B8] ml-1">PLN</span>
                            </span>
                            <span className="text-xs text-[#E2E8F0] font-bold">
                                z {limit.toFixed(2)} PLN
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm text-[#94A3B8] font-normal mb-1.5">
                                    <span><span className="font-bold text-[#E2E8F0]">Wykorzystano:</span> {percentUsed.toFixed(1)}%</span>
                                    <span>{spent.toFixed(2)} PLN</span>
                                </div>
                                <div className="w-full bg-[#0B0F19]/60 rounded-full h-3.5 p-0.5 border border-[#202E4C]/20">
                                    <div
                                        className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor(percentUsed)}`}
                                        style={{ width: `${Math.min(percentUsed, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm text-[#94A3B8] font-normal mb-1.5">
                                    <span><span className="font-bold text-[#E2E8F0]">Pozostało:</span> {percentRemaining.toFixed(1)}%</span>
                                    <span>{remaining.toFixed(2)} PLN</span>
                                </div>
                                <div className="w-full bg-[#0B0F19]/60 rounded-full h-3.5 p-0.5 border border-[#202E4C]/20">
                                    <div
                                        className="h-2.5 rounded-full transition-all duration-500 bg-[#3C7DC3] shadow-md shadow-[#3C7DC3]/20"
                                        style={{ width: `${Math.max(0, Math.min(percentRemaining, 100))}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <CategoryBudgetsSlider categories={budgetStatus.categories} />
                </div>
            )}

            <OverallBudgetModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                currentLimit={limit}
            />
        </div>
    )
}
