import { getAnalyticsByCategory, getAnalyticsByPeriod } from '@/lib/api/analytics'
import { getBudgetStatus } from '@/lib/api/budgets'
import { listCategories } from '@/lib/api/categories'
import { getTransaction, listTransactions } from '@/lib/api/transactions'
import type {
    AnalyticsByCategoryParams,
    AnalyticsByCategoryResponse,
    AnalyticsByPeriodParams,
    AnalyticsByPeriodResponse,
    BudgetStatusResponse,
    Category,
    Transaction,
    TransactionListParams,
} from '@/lib/api/types'

export async function getTransactionsData(params?: TransactionListParams): Promise<Transaction[]> {
    return listTransactions(params)
}

export async function getTransactionData(id: number): Promise<Transaction> {
    return getTransaction(id)
}

export async function getCategoriesData(): Promise<Category[]> {
    return listCategories()
}

export async function getBudgetStatusData(): Promise<BudgetStatusResponse> {
    return getBudgetStatus()
}

export async function getAnalyticsByCategoryData(
    params?: AnalyticsByCategoryParams,
): Promise<AnalyticsByCategoryResponse> {
    return getAnalyticsByCategory(params)
}

export async function getAnalyticsByPeriodData(
    params?: AnalyticsByPeriodParams,
): Promise<AnalyticsByPeriodResponse> {
    return getAnalyticsByPeriod(params)
}
