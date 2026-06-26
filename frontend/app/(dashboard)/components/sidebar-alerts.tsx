'use client'

import { AlertTriangle } from 'lucide-react'
import type { BudgetStatusResponse } from '@/lib/api/types'

type SidebarAlertsProps = {
    budgetStatus: BudgetStatusResponse
}

type AlertItem = {
    name: string
    percentUsed: number
    limit: number
    spent: number
}

export default function SidebarAlerts({ budgetStatus }: SidebarAlertsProps) {
    const activeAlerts: AlertItem[] = []

    const overall = budgetStatus.overall
    if (overall.limit !== null && overall.percentUsed !== null && overall.percentUsed >= 80) {
        activeAlerts.push({
            name: 'Budżet miesięczny',
            percentUsed: overall.percentUsed,
            limit: overall.limit,
            spent: overall.spent
        })
    }

    if (budgetStatus.categories) {
        for (const cat of budgetStatus.categories) {
            if (cat.limit > 0 && cat.percentUsed >= 80) {
                activeAlerts.push({
                    name: cat.categoryName || 'Bez kategorii',
                    percentUsed: cat.percentUsed,
                    limit: cat.limit,
                    spent: cat.spent
                })
            }
        }
    }

    if (activeAlerts.length === 0) {
        return null
    }

    return (
        <div className="space-y-2">
            <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1 px-1">
                Alerty budżetowe
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#202E4C]">
                {activeAlerts.map((alert, idx) => {
                    const isCritical = alert.percentUsed >= 95
                    return (
                        <div
                            key={idx}
                            className={`p-2.5 rounded-xl border flex items-start gap-2 text-xs transition-all w-full ${
                                isCritical
                                    ? 'bg-red-500/10 border-red-500/25 text-red-400'
                                    : 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400'
                            }`}
                        >
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0 break-words">
                                <div className="font-semibold leading-tight">
                                    {alert.name}
                                </div>
                                <div className="opacity-95 mt-0.5 leading-tight">
                                    Zużycie: <span className="font-bold">{alert.percentUsed.toFixed(1)}%</span>
                                </div>
                                <div className="opacity-75 mt-0.5 text-[10px] leading-tight">
                                    {alert.spent.toFixed(2)} / {alert.limit.toFixed(2)} PLN
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
