'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { AnalyticsByCategoryResponse } from '@/lib/api/types'

type CategoryExpensesCardProps = {
    analytics: AnalyticsByCategoryResponse
}

const COLORS = ['#A3C5FF', '#34D399', '#FBBF24', '#F87171', '#818CF8', '#C084FC', '#22D3EE', '#F472B6']

export default function CategoryExpensesCard({ analytics }: CategoryExpensesCardProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const hasData = analytics.data && analytics.data.length > 0 && analytics.totalExpenses > 0

    return (
        <div className="bg-[#161D30] border border-[#202E4C]/50 rounded-3xl p-6 flex flex-col justify-between h-full min-h-[380px]">
            <h3 className="font-bold text-white text-lg mb-4">Wydatki wg Kategorii</h3>

            {!hasData ? (
                <div className="flex-1 flex items-center justify-center text-center py-8">
                    <p className="text-xs text-[#94A3B8] max-w-[200px] leading-relaxed">
                        Brak zarejestrowanych wydatków w tym miesiącu.
                    </p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-center">
                    {isMounted ? (
                        <div className="h-[250px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics.data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {analytics.data.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="#161D30"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0B0F19',
                                            border: '1px solid rgba(32, 46, 76, 0.5)',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            color: '#E2E8F0'
                                        }}
                                        formatter={(value: any) => [`${Number(value || 0).toFixed(2)} PLN`, 'Wydatki']}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        iconSize={6}
                                        wrapperStyle={{ fontSize: '10px', color: '#94A3B8', marginTop: '10px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full border-2 border-[#A3C5FF] border-t-transparent animate-spin" />
                        </div>
                    )}
                    <div className="mt-4 text-center">
                        <span className="text-xs text-[#94A3B8]">Suma wydatków: </span>
                        <span className="text-sm font-bold text-white">
                            {analytics.totalExpenses.toFixed(2)} PLN
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
