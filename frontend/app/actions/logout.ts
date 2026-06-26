'use server'

import { cookies } from 'next/headers'
import type { FinanceActionResult } from './result'

export async function logoutAction(): Promise<FinanceActionResult> {
    try {
        const cookieStore = await cookies()
        cookieStore.delete('token')
        return { success: true }
    } catch {
        return { success: false, message: 'Nie udało się wylogować. Spróbuj ponownie.' }
    }
}
