'use server'

import { deleteCategoryBudget, setCategoryBudget, setOverallBudget } from '@/lib/api/budgets'
import type { BudgetLimit, SetBudgetInput } from '@/lib/api/types'
import type { FinanceActionResult } from './result'
import { getFinanceActionErrorMessage } from './result'

export async function setOverallBudgetAction(
    input: SetBudgetInput,
): Promise<FinanceActionResult<BudgetLimit>> {
    try {
        const data = await setOverallBudget(input)
        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się ustawić budżetu ogólnego. Spróbuj ponownie.',
            ),
        }
    }
}

export async function setCategoryBudgetAction(
    categoryId: number,
    input: SetBudgetInput,
): Promise<FinanceActionResult<BudgetLimit>> {
    try {
        const data = await setCategoryBudget(categoryId, input)
        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się ustawić limitu kategorii. Spróbuj ponownie.',
            ),
        }
    }
}

export async function deleteCategoryBudgetAction(categoryId: number): Promise<FinanceActionResult> {
    try {
        await deleteCategoryBudget(categoryId)
        return { success: true }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się usunąć limitu kategorii. Spróbuj ponownie.',
            ),
        }
    }
}
