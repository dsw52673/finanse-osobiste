'use server'

import {
    createTransaction,
    deleteTransaction,
    importTransactions,
    updateTransaction,
} from '@/lib/api/transactions'
import type {
    CreateTransactionInput,
    ImportTransactionsResponse,
    Transaction,
    UpdateTransactionInput,
} from '@/lib/api/types'
import type { FinanceActionResult } from './result'
import { getFinanceActionErrorMessage } from './result'

export async function createTransactionAction(
    input: CreateTransactionInput,
): Promise<FinanceActionResult<Transaction>> {
    try {
        const data = await createTransaction(input)
        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się dodać transakcji. Spróbuj ponownie.',
            ),
        }
    }
}

export async function updateTransactionAction(
    id: number,
    input: UpdateTransactionInput,
): Promise<FinanceActionResult<Transaction>> {
    try {
        const data = await updateTransaction(id, input)
        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się zaktualizować transakcji. Spróbuj ponownie.',
            ),
        }
    }
}

export async function deleteTransactionAction(id: number): Promise<FinanceActionResult> {
    try {
        await deleteTransaction(id)
        return { success: true }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się usunąć transakcji. Spróbuj ponownie.',
            ),
        }
    }
}

export async function importTransactionsAction(
    items: CreateTransactionInput[],
): Promise<FinanceActionResult<ImportTransactionsResponse>> {
    try {
        const data = await importTransactions(items)
        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się zaimportować transakcji. Spróbuj ponownie.',
            ),
        }
    }
}
