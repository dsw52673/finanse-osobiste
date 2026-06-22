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
        'Serwer nie zwrócił danych podczas pobierania kategorii',
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
        'Serwer nie zwrócił danych podczas tworzenia kategorii',
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
        'Serwer nie zwrócił danych podczas aktualizacji kategorii',
    )
}

export async function deleteCategory(id: number): Promise<void> {
    await apiRequest(`/api/categories/${id}`, {
        method: 'DELETE',
    })
}
