'use server'

import { createCategory, deleteCategory, updateCategory } from '@/lib/api/categories'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/lib/api/types'
import type { FinanceActionResult } from './result'
import { getFinanceActionErrorMessage } from './result'

export async function createCategoryAction(
    input: CreateCategoryInput,
): Promise<FinanceActionResult<Category>> {
    try {
        const data = await createCategory(input)
        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się dodać kategorii. Spróbuj ponownie.',
            ),
        }
    }
}

export async function updateCategoryAction(
    id: number,
    input: UpdateCategoryInput,
): Promise<FinanceActionResult<Category>> {
    try {
        const data = await updateCategory(id, input)
        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się zaktualizować kategorii. Spróbuj ponownie.',
            ),
        }
    }
}

export async function deleteCategoryAction(id: number): Promise<FinanceActionResult> {
    try {
        await deleteCategory(id)
        return { success: true }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się usunąć kategorii. Spróbuj ponownie.',
            ),
        }
    }
}
