'use client'

import { useEffect, useState } from 'react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts'

type AnalyticsViewProps = {
    categoryData: { name: string; value: number }[]
    balanceData: { name: string; Saldo: number }[]
    incomeExpensesData: { name: string; Przychody: number; Wydatki: number }[]
    monthlyExpensesData: { name: string; Kwota: number }[]
    cumulativeSavingsData: { name: string; Oszczędności: number }[]
}

const COLORS = ['#A3C5FF', '#34D399', '#FBBF24', '#F87171', '#818CF8', '#C084FC']

const tooltipStyle = {
    backgroundColor: '#0B0F19',
    border: '1px solid rgba(32, 46, 76, 0.5)',
    borderRadius: '12px',
    fontSize: '11px',
    color: '#E2E8F0'
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex-1 flex items-center justify-center text-center py-12">
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-[220px]">{message}</p>
        </div>
    )
}

export default function AnalyticsView({
    categoryData,
    balanceData,
    incomeExpensesData,
    monthlyExpensesData,
    cumulativeSavingsData
}: AnalyticsViewProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 rounded-full border-4 border-[#A3C5FF] border-t-transparent animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#161D30] border border-[#202E4C]/50 rounded-3xl p-6 flex flex-col min-h-[380px]">
                    <div className="mb-4">
                        <h3 className="font-bold text-white text-lg">Trend Salda</h3>
                        <p className="text-xs text-[#94A3B8] mt-0.5">Stan konta w PLN w ciągu ostatnich 30 dni</p>
                    </div>
                    {balanceData.length === 0 ? (
                        <EmptyState message="Brak zarejestrowanych transakcji w tym okresie." />
                    ) : (
                        <div className="flex-1 min-h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={balanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(32, 46, 76, 0.2)" />
                                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => [`${val} PLN`, 'Saldo']} />
                                    <Line
                                        type="monotone"
                                        dataKey="Saldo"
                                        stroke="#A3C5FF"
                                        strokeWidth={3}
                                        dot={{ fill: '#A3C5FF', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="bg-[#161D30] border border-[#202E4C]/50 rounded-3xl p-6 flex flex-col min-h-[380px]">
                    <div className="mb-4">
                        <h3 className="font-bold text-white text-lg">Kategorie Wydatków</h3>
                        <p className="text-xs text-[#94A3B8] mt-0.5">Podział procentowy wydatków w bieżącym miesiącu</p>
                    </div>
                    {categoryData.length === 0 ? (
                        <EmptyState message="Brak wydatków w tym miesiącu." />
                    ) : (
                        <div className="flex-1 min-h-[250px] w-full relative flex flex-col justify-center">
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {categoryData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="#161D30"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => [`${val} PLN`, 'Wydatki']} />
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
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#161D30] border border-[#202E4C]/50 rounded-3xl p-6 flex flex-col min-h-[380px]">
                    <div className="mb-4">
                        <h3 className="font-bold text-white text-lg">Przychody vs Wydatki</h3>
                        <p className="text-xs text-[#94A3B8] mt-0.5">Porównanie przepływów pieniężnych z ostatnich 6 miesięcy</p>
                    </div>
                    {incomeExpensesData.length === 0 ? (
                        <EmptyState message="Brak zarejestrowanych wpływów lub wydatków w historii." />
                    ) : (
                        <div className="flex-1 min-h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={incomeExpensesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(32, 46, 76, 0.2)" />
                                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => [`${val} PLN`]} />
                                    <Legend wrapperStyle={{ fontSize: '10px', color: '#94A3B8' }} />
                                    <Bar dataKey="Przychody" fill="#34D399" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Wydatki" fill="#F87171" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="bg-[#161D30] border border-[#202E4C]/50 rounded-3xl p-6 flex flex-col min-h-[380px]">
                    <div className="mb-4">
                        <h3 className="font-bold text-white text-lg">Wydatki Miesięczne</h3>
                        <p className="text-xs text-[#94A3B8] mt-0.5">Podsumowanie wydatków z ostatnich 6 miesięcy</p>
                    </div>
                    {monthlyExpensesData.length === 0 ? (
                        <EmptyState message="Brak wydatków w wybranym okresie." />
                    ) : (
                        <div className="flex-1 min-h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyExpensesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(32, 46, 76, 0.2)" />
                                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => [`${val} PLN`, 'Suma wydatków']} />
                                    <Bar dataKey="Kwota" fill="#818CF8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#161D30] border border-[#202E4C]/50 rounded-3xl p-6 flex flex-col min-h-[380px] w-full">
                <div className="mb-4">
                    <h3 className="font-bold text-white text-lg">Skumulowane Oszczędności</h3>
                    <p className="text-xs text-[#94A3B8] mt-0.5">Historyczny przyrost oszczędności netto na koncie</p>
                </div>
                {cumulativeSavingsData.length === 0 ? (
                    <EmptyState message="Brak wystarczających danych do obliczenia oszczędności." />
                ) : (
                    <div className="flex-1 min-h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cumulativeSavingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(32, 46, 76, 0.2)" />
                                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => [`${val} PLN`, 'Skumulowane Oszczędności']} />
                                <Area
                                    type="monotone"
                                    dataKey="Oszczędności"
                                    stroke="#34D399"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSavings)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    )
}
