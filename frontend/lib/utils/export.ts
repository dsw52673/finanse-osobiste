import type { Transaction, Category } from '@/lib/api/types'
import * as xlsx from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportToCSV(transactions: Transaction[], categories: Category[], filename: string = 'transakcje.csv') {
    const data = formatTransactionsForExport(transactions, categories)
    const worksheet = xlsx.utils.json_to_sheet(data)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Transakcje')
    xlsx.writeFile(workbook, filename)
}

export function exportToExcel(transactions: Transaction[], categories: Category[], filename: string = 'transakcje.xlsx') {
    const data = formatTransactionsForExport(transactions, categories)
    const worksheet = xlsx.utils.json_to_sheet(data)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Transakcje')
    xlsx.writeFile(workbook, filename)
}

export function exportToPDF(transactions: Transaction[], categories: Category[], filename: string = 'transakcje.pdf') {
    const data = formatTransactionsForExport(transactions, categories)
    const doc = new jsPDF()
    doc.text('Historia Transakcji', 14, 15)
    
    const tableColumn = ["Typ", "Kwota", "Kategoria", "Data", "Opis"]
    const tableRows: any[] = []

    data.forEach(t => {
        const rowData = [
            t.Typ,
            t.Kwota,
            t.Kategoria,
            t.Data,
            t.Opis
        ]
        tableRows.push(rowData)
    })

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    })
    
    doc.save(filename)
}

function formatTransactionsForExport(transactions: Transaction[], categories: Category[]) {
    return transactions.map(t => {
        const category = categories.find(c => c.id === t.categoryId)
        return {
            Typ: t.type === 'INCOME' ? 'Przychód' : 'Wydatek',
            Kwota: t.amount.toFixed(2) + ' PLN',
            Kategoria: category?.name || 'Brak',
            Data: new Date(t.date).toLocaleDateString('pl-PL'),
            Opis: t.description || ''
        }
    })
}
