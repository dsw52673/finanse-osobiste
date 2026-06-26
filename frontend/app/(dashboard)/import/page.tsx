'use client'

import { useState, useTransition } from 'react'
import { UploadCloud, FileType2, Loader2 } from 'lucide-react'
import { parseFileToTransactions, type ImportedTransaction } from '@/lib/utils/import'
import ImportPreviewTable from './components/import-preview-table'
import ImportSuccessModal from './components/import-success-modal'
import { importTransactionsAction } from '@/app/actions/transactions'
import type { CreateTransactionInput } from '@/lib/api/types'

export default function ImportPage() {
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [transactions, setTransactions] = useState<ImportedTransaction[]>([])
    const [isParsing, setIsParsing] = useState(false)
    const [isImporting, startTransition] = useTransition()
    const [successCount, setSuccessCount] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleFileSelect(selectedFile: File) {
        if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
            setError('Obsługiwane są tylko pliki .csv oraz .xlsx')
            return
        }

        setError(null)
        setFile(selectedFile)
        setIsParsing(true)

        try {
            const parsed = await parseFileToTransactions(selectedFile)
            setTransactions(parsed)
        } catch (err) {
            setError('Wystąpił błąd podczas analizy pliku')
        } finally {
            setIsParsing(false)
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    function handleToggleSelect(id: string) {
        setTransactions(prev => prev.map(t =>
            t.id === id && t.isValid ? { ...t, selected: !t.selected } : t
        ))
    }

    function handleToggleSelectAll() {
        const validTransactions = transactions.filter(t => t.isValid)
        const allSelected = validTransactions.length > 0 && validTransactions.every(t => t.selected)

        setTransactions(prev => prev.map(t =>
            t.isValid ? { ...t, selected: !allSelected } : t
        ))
    }

    function handleImport() {
        const selected = transactions.filter(t => t.selected && t.isValid)
        if (selected.length === 0) return

        const inputs: CreateTransactionInput[] = selected.map(t => ({
            amount: t.amount,
            type: t.type,
            date: t.date,
            description: t.description || undefined,
            currency: 'PLN'
        }))

        startTransition(async () => {
            const res = await importTransactionsAction(inputs)
            if (res?.success) {
                setSuccessCount(res?.data?.count || 0)
            } else {
                setError(res?.message)
            }
        })
    }

    function handleReset() {
        setFile(null)
        setTransactions([])
        setSuccessCount(null)
        setError(null)
    }

    return (
        <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Import Transakcji</h2>
            </div>

            {!file ? (
                <div
                    className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 transition-colors ${isDragging ? 'border-[#A3C5FF] bg-[#A3C5FF]/5' : 'border-[#202E4C] bg-[#161D30]/50'
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <UploadCloud className={`w-16 h-16 mb-6 ${isDragging ? 'text-[#A3C5FF]' : 'text-[#202E4C]'}`} />
                    <h3 className="text-xl font-bold text-white mb-2">Przeciągnij i upuść plik tutaj</h3>
                    <p className="text-[#94A3B8] mb-8 text-center max-w-md">
                        Obsługiwane formaty to .csv oraz .xlsx. Możesz wyeksportować historię ze swojego banku i wgrać ją bezpośrednio.
                    </p>
                    <label className="bg-[#A3C5FF] text-[#0B0F19] hover:bg-[#8AB4F8] transition-colors px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#A3C5FF]/10 cursor-pointer">
                        Wybierz plik z dysku
                        <input
                            type="file"
                            accept=".csv,.xlsx"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    handleFileSelect(e.target.files[0])
                                }
                            }}
                        />
                    </label>
                    {error && <p className="text-red-400 mt-6 font-medium">{error}</p>}
                </div>
            ) : (
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between bg-[#161D30]/80 border border-[#202E4C]/30 p-5 rounded-2xl flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#202E4C]/40 rounded-xl flex items-center justify-center">
                                <FileType2 className="w-6 h-6 text-[#A3C5FF]" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{file.name}</h3>
                                <p className="text-xs text-[#94A3B8] mt-0.5">
                                    Znaleziono {transactions.length} wierszy
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={isImporting || isParsing || transactions.filter(t => t.selected).length === 0}
                                className="flex items-center gap-2 bg-[#A3C5FF] text-[#0B0F19] hover:bg-[#8AB4F8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-5 py-2 rounded-xl font-bold shadow-lg shadow-[#A3C5FF]/10 cursor-pointer"
                            >
                                {isImporting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Zaimportuj ({transactions.filter(t => t.selected).length})
                            </button>
                        </div>
                    </div>

                    {error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-medium">{error}</div>}

                    {isParsing ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 mt-6">
                            <Loader2 className="w-10 h-10 text-[#A3C5FF] animate-spin mb-4" />
                            <p className="text-[#94A3B8]">Analizowanie pliku...</p>
                        </div>
                    ) : transactions.length > 0 ? (
                        <ImportPreviewTable
                            transactions={transactions}
                            onToggleSelect={handleToggleSelect}
                            onToggleSelectAll={handleToggleSelectAll}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-12 mt-6 text-[#94A3B8] italic">
                            Brak danych do wyświetlenia. Spróbuj inny plik.
                        </div>
                    )}
                </div>
            )}

            {successCount !== null && (
                <ImportSuccessModal count={successCount} onReset={handleReset} />
            )}
        </div>
    )
}
