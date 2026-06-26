import type { Category } from '@/lib/api/types'

export function getCleanCategoryName(name: string): string {
    if (name.startsWith('[Wpływ] ')) return name.replace('[Wpływ] ', '')
    if (name.startsWith('[Wydatek] ')) return name.replace('[Wydatek] ', '')
    return name
}

export function getCategoryType(category: Category): 'INCOME' | 'EXPENSE' {
    if (category.name === 'Wynagrodzenie') return 'INCOME'
    if (category.name.startsWith('[Wpływ] ')) return 'INCOME'
    return 'EXPENSE'
}
