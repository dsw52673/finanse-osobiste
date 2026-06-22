import { apiFetch, apiRequest } from './client'
import type { LoginInput, RegisteredUser, RegisterInput } from './types'

export async function register(input: RegisterInput): Promise<RegisteredUser> {
    const user = await apiRequest<RegisteredUser>('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })

    if (!user) {
        throw new Error('Serwer nie zwrócił danych podczas rejestracji')
    }

    return user
}

export async function login(input: LoginInput): Promise<Response> {
    return apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })
}
