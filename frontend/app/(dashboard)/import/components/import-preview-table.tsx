'use client'

import type { ImportedTransaction } from '@/lib/utils/import'

type ImportPreviewTableProps = {
    transactions: ImportedTransaction[]
    onToggleSelect: (id: string) => void
    onToggleSelectAll: () => void
}

export default function ImportPreviewTable({
    transactions,
    onToggleSelect,
    onToggleSelectAll
}: ImportPreviewTableProps) {
    const allValid = transactions.filter(t => t.isValid)
    const allSelected = allValid.length > 0 && allValid.every(t => t.selected)
    
    return (
        <div className="bg-[#161D30]/80 border border-[#202E4C]/30 rounded-2xl overflow-hidden shadow-xl mt-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#202E4C]/45 bg-[#0B0F19]/40">
                            <th className="p-3 w-10">
                                <input 
                                    type="checkbox" 
                                    checked={allSelected}
                                    onChange={onToggleSelectAll}
                                    className="appearance-none w-[18px] h-[18px] border-2 border-[#202E4C] rounded-md bg-[#161D30]/50 hover:bg-[#161D30] hover:border-[#A3C5FF]/50 checked:bg-[#A3C5FF] checked:border-[#A3C5FF] transition-all cursor-pointer relative flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%230B0F19%22%20stroke-width%3D%223.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%2220%206%209%2017%204%2012%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] before:bg-no-repeat before:bg-center before:bg-[length:10px_10px] before:opacity-0 checked:before:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </th>
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Status</th>
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Typ</th>
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Kwota</th>
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Kategoria z pliku</th>
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Data</th>
                            <th className="p-3 text-xs font-semibold text-[#94A3B8] uppercase">Opis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id} className={`border-b border-[#202E4C]/25 transition-colors hover:bg-[#0B0F19]/25 ${!t.isValid ? 'bg-red-500/10' : ''}`}>
                                <td className="p-3">
                                    <input 
                                        type="checkbox" 
                                        checked={t.selected}
                                        onChange={() => onToggleSelect(t.id)}
                                        disabled={!t.isValid}
                                        className="appearance-none w-[18px] h-[18px] border-2 border-[#202E4C] rounded-md bg-[#161D30]/50 hover:bg-[#161D30] hover:border-[#A3C5FF]/50 checked:bg-[#A3C5FF] checked:border-[#A3C5FF] transition-all cursor-pointer relative flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%230B0F19%22%20stroke-width%3D%223.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%2220%206%209%2017%204%2012%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] before:bg-no-repeat before:bg-center before:bg-[length:10px_10px] before:opacity-0 checked:before:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </td>
                                <td className="p-3 text-sm">
                                    {t.isValid ? (
                                        <span className="text-green-400 font-medium">Gotowe</span>
                                    ) : (
                                        <span className="text-red-400 font-medium">Błąd danych</span>
                                    )}
                                </td>
                                <td className="p-3 text-sm font-semibold text-white">
                                    {t.type === 'INCOME' ? 'Wpływ' : 'Wydatek'}
                                </td>
                                <td className="p-3 text-sm font-bold text-white">
                                    {t.amount.toFixed(2)} PLN
                                </td>
                                <td className="p-3 text-sm text-[#94A3B8]">{t.categoryName || '-'}</td>
                                <td className="p-3 text-sm text-[#94A3B8]">{t.date ? new Date(t.date).toLocaleDateString('pl-PL') : '-'}</td>
                                <td className="p-3 text-sm text-[#E2E8F0] max-w-xs truncate">{t.description || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
