import { ApiError } from '@/lib/api/client'

export type FinanceActionResult<T = undefined> =
    | { success: true, data?: T }
    | { success: false, message: string }

export function getFinanceActionErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof ApiError) {
        if (error.status === 400) {
            return 'Sprawdź poprawność danych formularza'
        }

        if (error.status === 401) {
            return 'Sesja wygasła. Zaloguj się ponownie.'
        }

        if (error.status === 403) {
            return 'Nie masz uprawnień do wykonania tej operacji.'
        }

        if (error.status === 404) {
            return 'Nie znaleziono wskazanego zasobu.'
        }
    }

    return fallback
}
