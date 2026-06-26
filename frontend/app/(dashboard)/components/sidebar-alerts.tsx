'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { BudgetStatusResponse } from '@/lib/api/types'
import { getCleanCategoryName } from '@/lib/category-helpers'

type SidebarAlertsProps = {
    budgetStatus?: BudgetStatusResponse
}

type AlertItem = {
    name: string
    percentUsed: number
    limit: number
    spent: number
}

export default function SidebarAlerts({ budgetStatus }: SidebarAlertsProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    if (!budgetStatus || !budgetStatus.overall) {
        return null
    }

    const categoryAlerts: AlertItem[] = []
    if (budgetStatus.categories) {
        for (const cat of budgetStatus.categories) {
            if (cat.limit > 0 && cat.percentUsed >= 80) {
                categoryAlerts.push({
                    name: cat.categoryName ? getCleanCategoryName(cat.categoryName) : 'Bez kategorii',
                    percentUsed: cat.percentUsed,
                    limit: cat.limit,
                    spent: cat.spent
                })
            }
        }
    }

    categoryAlerts.sort((a, b) => b.percentUsed - a.percentUsed)

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

    activeAlerts.push(...categoryAlerts)

    useEffect(() => {
        if (activeIndex >= activeAlerts.length) {
            setActiveIndex(0)
        }
    }, [activeAlerts.length, activeIndex])

    if (activeAlerts.length === 0) {
        return null
    }

    const alert = activeAlerts[activeIndex]
    if (!alert) return null

    const isCritical = alert.percentUsed >= 95

    function handlePrev() {
        setActiveIndex((prev) => (prev === 0 ? activeAlerts.length - 1 : prev - 1))
    }

    function handleNext() {
        setActiveIndex((prev) => (prev === activeAlerts.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">
                    Alerty budżetowe
                </span>
                {activeAlerts.length > 1 && (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="p-0.5 bg-[#202E4C]/40 text-[#A3C5FF] hover:bg-[#202E4C]/70 rounded border border-[#202E4C]/30 cursor-pointer"
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </button>
                        <span className="text-[9px] text-[#94A3B8] font-bold">
                            {activeIndex + 1}/{activeAlerts.length}
                        </span>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="p-0.5 bg-[#202E4C]/40 text-[#A3C5FF] hover:bg-[#202E4C]/70 rounded border border-[#202E4C]/30 cursor-pointer"
                        >
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                )}
            </div>

            <div
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
        </div>
    )
}
