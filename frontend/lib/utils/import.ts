import * as xlsx from 'xlsx'

export type ImportedTransaction = {
    id: string
    type: 'INCOME' | 'EXPENSE'
    amount: number
    categoryId: number | null
    categoryName: string
    date: string
    description: string
    selected: boolean
    isValid: boolean
}

export async function parseFileToTransactions(file: File): Promise<ImportedTransaction[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = xlsx.read(data, { type: 'array' })
                const firstSheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[firstSheetName]
                
                const jsonData = xlsx.utils.sheet_to_json<any>(worksheet)
                
                const transactions = jsonData.map((row, index) => {
                    return mapRowToTransaction(row, index)
                })
                
                resolve(transactions)
            } catch (error) {
                reject(new Error('Nie udało się przetworzyć pliku'))
            }
        }
        
        reader.onerror = () => {
            reject(new Error('Błąd odczytu pliku'))
        }
        
        reader.readAsArrayBuffer(file)
    })
}

function mapRowToTransaction(row: any, index: number): ImportedTransaction {
    const typeStr = (row.Typ || row.type || row.Type || row.typ || '').toString().toLowerCase()
    const type = (typeStr === 'przychód' || typeStr === 'income' || typeStr === 'wpływ' || typeStr === 'przychod') ? 'INCOME' : 'EXPENSE'
    
    let amount = parseFloat(row.Kwota || row.amount || row.Amount || row.kwota)
    if (isNaN(amount)) {
        if (typeof row.Kwota === 'string') {
            amount = parseFloat(row.Kwota.replace(',', '.').replace(/[^\d.-]/g, ''))
        } else {
            amount = 0
        }
    }
    if (isNaN(amount)) amount = 0
    amount = Math.abs(amount)
    
    const categoryName = (row.Kategoria || row.category || row.Category || row.kategoria || '').toString()
    
    let dateStr = row.Data || row.date || row.Date || row.data || ''
    let parsedDate = ''
    
    if (typeof dateStr === 'number') {
        const dateObj = new Date((dateStr - (25567 + 2)) * 86400 * 1000)
        if (!isNaN(dateObj.getTime())) {
            parsedDate = dateObj.toISOString()
        }
    } else {
        const parts = String(dateStr).split('.')
        if (parts.length === 3) {
            const dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00.000Z`)
            if (!isNaN(dateObj.getTime())) {
                parsedDate = dateObj.toISOString()
            }
        } else {
            const dateObj = new Date(dateStr)
            if (!isNaN(dateObj.getTime())) {
                parsedDate = dateObj.toISOString()
            }
        }
    }
    
    const description = (row.Opis || row.description || row.Description || row.opis || '').toString()
    
    const isValid = amount > 0 && parsedDate !== ''
    
    return {
        id: `import-${index}-${Date.now()}`,
        type,
        amount,
        categoryId: null,
        categoryName,
        date: parsedDate,
        description,
        selected: isValid,
        isValid
    }
}
