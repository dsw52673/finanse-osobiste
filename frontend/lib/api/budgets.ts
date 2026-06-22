import { apiRequest } from './client'
import type { BudgetLimit, BudgetStatusResponse, SetBudgetInput } from './types'

function requireResult<T>(result: T | undefined, message: string): T {
    if (result === undefined) {
        throw new Error(message)
    }

    return result
}

export async function setOverallBudget(input: SetBudgetInput): Promise<BudgetLimit> {
    return requireResult(
        await apiRequest<BudgetLimit>('/api/budgets', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }),
        'Empty response from set overall budget endpoint',
    )
}

export async function setCategoryBudget(categoryId: number, input: SetBudgetInput): Promise<BudgetLimit> {
    return requireResult(
        await apiRequest<BudgetLimit>(`/api/budgets/category/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }),
        'Empty response from set category budget endpoint',
    )
}

export async function deleteCategoryBudget(categoryId: number): Promise<void> {
    await apiRequest(`/api/budgets/category/${categoryId}`, {
        method: 'DELETE',
    })
}

export async function getBudgetStatus(): Promise<BudgetStatusResponse> {
    return requireResult(
        await apiRequest<BudgetStatusResponse>('/api/budgets/status'),
        'Empty response from get budget status endpoint',
    )
}
