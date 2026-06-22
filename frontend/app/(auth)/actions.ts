'use server'

import { cookies } from 'next/headers'
import { login, register } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import type { LoginInput, RegisterInput } from '@/lib/api/types'

export type AuthActionResult = {
    success: boolean
    message?: string
}

function extractTokenFromSetCookie(setCookie: string): string | null {
    const firstPart = setCookie.split(';')[0]?.trim()

    if (!firstPart?.startsWith('token=')) {
        return null
    }

    const value = firstPart.slice('token='.length)

    return value || null
}

function getSetCookieHeaders(response: Response): string[] {
    if (typeof response.headers.getSetCookie === 'function') {
        return response.headers.getSetCookie()
    }

    const header = response.headers.get('set-cookie')

    return header ? [header] : []
}

export async function registerAction(input: RegisterInput): Promise<AuthActionResult> {
    try {
        await register(input)
        return { success: true }
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.status === 400) {
                return { success: false, message: 'Sprawdź poprawność danych formularza' }
            }

            if (error.status === 409) {
                return { success: false, message: 'Konto z tym adresem e-mail już istnieje' }
            }
        }

        return { success: false, message: 'Nie udało się utworzyć konta. Spróbuj ponownie.' }
    }
}

export async function loginAction(input: LoginInput): Promise<AuthActionResult> {
    try {
        const response = await login(input)

        if (response.status === 401) {
            return { success: false, message: 'Nieprawidłowy adres e-mail lub hasło' }
        }

        if (!response.ok) {
            return { success: false, message: 'Nie udało się zalogować. Spróbuj ponownie.' }
        }

        let token: string | null = null

        for (const header of getSetCookieHeaders(response)) {
            token = extractTokenFromSetCookie(header)

            if (token) {
                break
            }
        }

        if (!token) {
            return { success: false, message: 'Nie udało się utworzyć sesji użytkownika' }
        }

        const cookieStore = await cookies()

        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        })

        return { success: true }
    } catch {
        return { success: false, message: 'Nie udało się zalogować. Spróbuj ponownie.' }
    }
}
