import { apiRequest } from './client'
import type {
    CreateTransactionInput,
    ImportTransactionsResponse,
    Transaction,
    TransactionListParams,
    UpdateTransactionInput,
} from './types'

function requireResult<T>(result: T | undefined, message: string): T {
    if (result === undefined) {
        throw new Error(message)
    }

    return result
}

function buildQueryString(params?: TransactionListParams): string {
    if (!params) {
        return ''
    }

    const searchParams = new URLSearchParams()

    if (params.dateFrom !== undefined) {
        searchParams.set('dateFrom', params.dateFrom)
    }

    if (params.dateTo !== undefined) {
        searchParams.set('dateTo', params.dateTo)
    }

    if (params.type !== undefined) {
        searchParams.set('type', params.type)
    }

    if (params.categoryId !== undefined) {
        searchParams.set('categoryId', String(params.categoryId))
    }

    const query = searchParams.toString()

    return query ? `?${query}` : ''
}

export async function listTransactions(params?: TransactionListParams): Promise<Transaction[]> {
    return requireResult(
        await apiRequest<Transaction[]>(`/api/transactions${buildQueryString(params)}`),
        'Empty response from list transactions endpoint',
    )
}

export async function getTransaction(id: number): Promise<Transaction> {
    return requireResult(
        await apiRequest<Transaction>(`/api/transactions/${id}`),
        'Empty response from get transaction endpoint',
    )
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    return requireResult(
        await apiRequest<Transaction>('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }),
        'Empty response from create transaction endpoint',
    )
}

export async function updateTransaction(id: number, input: UpdateTransactionInput): Promise<Transaction> {
    return requireResult(
        await apiRequest<Transaction>(`/api/transactions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }),
        'Empty response from update transaction endpoint',
    )
}

export async function deleteTransaction(id: number): Promise<void> {
    await apiRequest(`/api/transactions/${id}`, {
        method: 'DELETE',
    })
}

export async function importTransactions(items: CreateTransactionInput[]): Promise<ImportTransactionsResponse> {
    return requireResult(
        await apiRequest<ImportTransactionsResponse>('/api/transactions/import', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(items),
        }),
        'Empty response from import transactions endpoint',
    )
}
