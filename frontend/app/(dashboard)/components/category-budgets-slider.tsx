'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CategoryBudgetStatus } from '@/lib/api/types'
import { getCleanCategoryName } from '@/lib/category-helpers'

type CategoryBudgetsSliderProps = {
    categories: CategoryBudgetStatus[]
}

export default function CategoryBudgetsSlider({ categories }: CategoryBudgetsSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    if (categories.length === 0) return null

    const sorted = [...categories].sort((a, b) => b.percentUsed - a.percentUsed)

    const cat = sorted[activeIndex]
    if (!cat) return null

    function handlePrev() {
        setActiveIndex((prev) => (prev === 0 ? sorted.length - 1 : prev - 1))
    }

    function handleNext() {
        setActiveIndex((prev) => (prev === sorted.length - 1 ? 0 : prev + 1))
    }

    function getProgressBarColor(percent: number) {
        if (percent >= 95) return 'bg-red-500 shadow-md shadow-red-500/20'
        if (percent >= 80) return 'bg-yellow-500 shadow-md shadow-yellow-500/20'
        return 'bg-[#A3C5FF] shadow-md shadow-[#A3C5FF]/20'
    }

    return (
        <div className="mt-4 pt-4 border-t border-[#202E4C]/45 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#A3C5FF] uppercase tracking-wider">
                    Limity kategorii
                </span>
                {sorted.length > 1 && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="p-1 bg-[#202E4C]/40 text-[#A3C5FF] hover:bg-[#202E4C]/70 rounded-md border border-[#202E4C]/30 cursor-pointer"
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </button>
                        <span className="text-[10px] text-[#94A3B8] font-semibold">
                            {activeIndex + 1} / {sorted.length}
                        </span>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="p-1 bg-[#202E4C]/40 text-[#A3C5FF] hover:bg-[#202E4C]/70 rounded-md border border-[#202E4C]/30 cursor-pointer"
                        >
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#94A3B8] font-normal">
                    <span>
                        <span className="font-bold text-[#E2E8F0]">{getCleanCategoryName(cat.categoryName || '')}:</span>{' '}
                        {cat.percentUsed.toFixed(1)}%
                    </span>
                    <span>{cat.spent.toFixed(2)} / {cat.limit.toFixed(2)} PLN</span>
                </div>
                <div className="w-full bg-[#0B0F19]/60 rounded-full h-2.5 p-0.5 border border-[#202E4C]/20">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${getProgressBarColor(cat.percentUsed)}`}
                        style={{ width: `${Math.min(cat.percentUsed, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
