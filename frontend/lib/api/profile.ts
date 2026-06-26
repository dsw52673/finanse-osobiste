import { apiRequest } from './client'
import type { UpdateEmailInput, UpdatePasswordInput } from './types'

export async function updateEmail(input: UpdateEmailInput): Promise<{ success: boolean }> {
    const result = await apiRequest<{ success: boolean }>('/api/profile/email', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })
    
    if (!result) {
        throw new Error('Serwer nie zwrócił danych podczas aktualizacji e-maila')
    }
    return result
}

export async function updatePassword(input: UpdatePasswordInput): Promise<{ success: boolean }> {
    const result = await apiRequest<{ success: boolean }>('/api/profile/password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })
    
    if (!result) {
        throw new Error('Serwer nie zwrócił danych podczas aktualizacji hasła')
    }
    return result
}
