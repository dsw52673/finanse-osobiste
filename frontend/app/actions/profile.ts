'use server'

import { cookies } from 'next/headers'
import { updateEmail, updatePassword } from '@/lib/api/profile'
import type { UpdateEmailInput, UpdatePasswordInput } from '@/lib/api/types'
import type { FinanceActionResult } from './result'
import { getFinanceActionErrorMessage } from './result'

export async function changeEmailAction(
    input: UpdateEmailInput,
): Promise<FinanceActionResult<{ success: boolean }>> {
    try {
        const data = await updateEmail(input)

        const cookieStore = await cookies()
        cookieStore.delete('token')

        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się zaktualizować adresu e-mail. Sprawdź, czy aktualne hasło jest poprawne.',
            ),
        }
    }
}

export async function changePasswordAction(
    input: UpdatePasswordInput,
): Promise<FinanceActionResult<{ success: boolean }>> {
    try {
        const data = await updatePassword(input)

        const cookieStore = await cookies()
        cookieStore.delete('token')

        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: getFinanceActionErrorMessage(
                error,
                'Nie udało się zaktualizować hasła. Sprawdź, czy aktualne hasło jest poprawne.',
            ),
        }
    }
}
