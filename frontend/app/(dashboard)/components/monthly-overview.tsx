'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Transaction, BudgetOverallStatus } from '@/lib/api/types'

const MONTH_NAMES = [
    'STYCZEŃ', 'LUTY', 'MARZEC', 'KWIECIEŃ', 'MAJ', 'CZERWIEC',
    'LIPIEC', 'SIERPIEŃ', 'WRZESIEŃ', 'PAŹDZIERNIK', 'LISTOPAD', 'GRUDZIEŃ'
]

const WEEK_DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd']

type MonthlyOverviewProps = {
    transactions: Transaction[]
    overallBudget: BudgetOverallStatus
}

export default function MonthlyOverview({ transactions, overallBudget }: MonthlyOverviewProps) {
    const [currentDate, setCurrentDate] = useState(() => new Date())

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayIndex = new Date(year, month, 1).getDay()
    const startingDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1

    const totalDays = new Date(year, month + 1, 0).getDate()
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1)
    const emptyCellsArray = Array.from({ length: startingDayOffset }, (_, i) => i)

    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

    function changeMonth(offset: number) {
        setCurrentDate(new Date(year, month + offset, 1))
    }

    function getDailyStats(day: number) {
        let expenses = 0
        let income = 0
        for (const t of transactions) {
            const tDate = new Date(t.date)
            if (
                tDate.getFullYear() === year &&
                tDate.getMonth() === month &&
                tDate.getDate() === day
            ) {
                if (t.type === 'INCOME') {
                    income += t.amount
                } else if (t.type === 'EXPENSE') {
                    expenses += t.amount
                }
            }
        }
        return { expenses, income }
    }

    const monthlyLimit = overallBudget.limit || 4000

    return (
        <div className="bg-[#161D30] border border-[#202E4C]/50 rounded-3xl p-6 flex flex-col h-full select-none">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-lg">Przegląd Miesięczny</h3>
                <div className="flex items-center gap-2 bg-[#0B0F19]/40 border border-[#202E4C]/30 rounded-xl px-2 py-1">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-1 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-semibold text-white px-2 tracking-wider">
                        {MONTH_NAMES[month]} {year}
                    </span>
                    <button
                        onClick={() => changeMonth(1)}
                        className="p-1 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-xs font-semibold text-[#94A3B8] mb-3">
                {WEEK_DAYS.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2.5 gap-x-2 text-center text-sm font-medium flex-1">
                {emptyCellsArray.map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                ))}
                
                {daysArray.map((day) => {
                    const { expenses: dailyExpenses, income: dailyIncome } = getDailyStats(day)

                    let dayStyle: React.CSSProperties = {}
                    let dayClass = 'text-[#E2E8F0] cursor-default'

                    if (dailyIncome > dailyExpenses) {
                        const ratio = monthlyLimit > 0 ? dailyIncome / monthlyLimit : 0
                        const opacity = Math.min(ratio, 1) * 0.8 + 0.15
                        dayStyle = {
                            backgroundColor: `rgba(34, 197, 94, ${opacity})`,
                        }
                        dayClass = 'text-white font-semibold cursor-default'
                    } else if (dailyExpenses > dailyIncome) {
                        const ratio = monthlyLimit > 0 ? dailyExpenses / monthlyLimit : 0
                        const opacity = Math.min(ratio, 1) * 0.8 + 0.15
                        dayStyle = {
                            backgroundColor: `rgba(239, 68, 68, ${opacity})`,
                        }
                        dayClass = 'text-white font-semibold cursor-default'
                    } else {
                        dayClass = 'text-[#E2E8F0] hover:bg-[#1E293B]/60 hover:text-white cursor-default'
                    }

                    return (
                        <div
                            key={day}
                            style={dayStyle}
                            className={`aspect-square flex items-center justify-center rounded-xl transition-all ${dayClass}`}
                        >
                            {day}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

