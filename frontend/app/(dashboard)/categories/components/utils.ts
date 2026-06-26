import type { Category } from '@/lib/api/types'

export const SYSTEM_CATEGORIES = [
    'Inne',
    'Czynsz',
    'Jedzenie',
    'Paliwo',
    'Rozrywka',
    'Subskrypcje',
    'Wynagrodzenie'
]

export function sortCategories(list: Category[]): Category[] {
    return [...list].sort((a, b) => {
        const aIsSystem = a.isSystem || SYSTEM_CATEGORIES.includes(a.name)
        const bIsSystem = b.isSystem || SYSTEM_CATEGORIES.includes(b.name)

        if (aIsSystem && bIsSystem) {
            if (a.name === 'Inne') return -1
            if (b.name === 'Inne') return 1
            return a.name.localeCompare(b.name)
        }

        if (aIsSystem) return -1
        if (bIsSystem) return 1

        return a.name.localeCompare(b.name)
    })
}
