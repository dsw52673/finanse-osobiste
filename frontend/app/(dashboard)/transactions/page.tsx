import { getTransactionsData, getCategoriesData } from '@/lib/queries/finance'
import TransactionHistoryTable from './components/transaction-history-table'

export default async function TransactionsPage() {
    const [transactions, categories] = await Promise.all([
        getTransactionsData(),
        getCategoriesData()
    ])

    return (
        <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Historia Transakcji</h2>
            </div>
            <TransactionHistoryTable transactions={transactions} categories={categories} />
        </div>
    )
}
