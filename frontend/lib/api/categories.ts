import { apiRequest } from './client'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from './types'

function requireResult<T>(result: T | undefined, message: string): T {
    if (result === undefined) {
        throw new Error(message)
    }

    return result
}

export async function listCategories(): Promise<Category[]> {
    return requireResult(
        await apiRequest<Category[]>('/api/categories'),
        'Empty response from list categories endpoint',
    )
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
    return requireResult(
        await apiRequest<Category>('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }),
        'Empty response from create category endpoint',
    )
}

export async function updateCategory(id: number, input: UpdateCategoryInput): Promise<Category> {
    return requireResult(
        await apiRequest<Category>(`/api/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }),
        'Empty response from update category endpoint',
    )
}

export async function deleteCategory(id: number): Promise<void> {
    await apiRequest(`/api/categories/${id}`, {
        method: 'DELETE',
    })
}
