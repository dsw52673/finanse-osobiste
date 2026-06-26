export type IsoDateString = string

export type TransactionType = 'INCOME' | 'EXPENSE'

export type CurrencyCode = string

export type User = {
    id: number
    email: string
}

export type RegisteredUser = {
    id: number
    email: string
    createdAt: IsoDateString
}

export type RegisterInput = {
    email: string
    password: string
}

export type LoginInput = {
    email: string
    password: string
}

export type LoginResponse = {
    id: number
    email: string
}

export type Category = {
    id: number
    name: string
    userId: number | null
    isSystem: boolean
    createdAt: IsoDateString
    updatedAt: IsoDateString
}

export type CreateCategoryInput = {
    name: string
}

export type UpdateCategoryInput = {
    name: string
}

export type TransactionCategory = {
    id: number
    name: string
}

export type Transaction = {
    id: number
    amount: number
    currency: CurrencyCode
    type: TransactionType
    description: string | null
    date: IsoDateString
    userId: number
    categoryId: number | null
    category: TransactionCategory | null
    createdAt: IsoDateString
    updatedAt: IsoDateString
}

export type CreateTransactionInput = {
    amount: number
    currency?: CurrencyCode
    type: TransactionType
    description?: string
    date: IsoDateString
    categoryId?: number | null
}

export type UpdateTransactionInput = {
    amount: number
    currency?: CurrencyCode
    type: TransactionType
    description?: string
    date: IsoDateString
    categoryId?: number | null
}

export type TransactionListParams = {
    dateFrom?: string
    dateTo?: string
    type?: TransactionType
    categoryId?: number
}

export type ImportTransactionsResponse = {
    count: number
}

export type BudgetLimit = {
    id: number
    amount: number
    month: number
    year: number
    userId: number
    categoryId: number | null
    createdAt: IsoDateString
    updatedAt: IsoDateString
}

export type SetBudgetInput = {
    amount: number
    month?: number
    year?: number
}

export type BudgetOverallStatus = {
    limit: number | null
    spent: number
    remaining: number | null
    percentUsed: number | null
}

export type CategoryBudgetStatus = {
    categoryId: number | null
    categoryName: string | null
    limit: number
    spent: number
    remaining: number
    percentUsed: number
}

export type BudgetStatusResponse = {
    month: number
    year: number
    overall: BudgetOverallStatus
    categories: CategoryBudgetStatus[]
}

export type AnalyticsByCategoryParams = {
    month?: number
    year?: number
}

export type AnalyticsByCategoryItem = {
    name: string
    value: number
}

export type AnalyticsByCategoryResponse = {
    month: number
    year: number
    totalExpenses: number
    data: AnalyticsByCategoryItem[]
}

export type AnalyticsByPeriodParams = {
    groupBy?: 'day' | 'month'
    dateFrom?: string
    dateTo?: string
}

export type AnalyticsByPeriodItem = {
    period: string
    expenses: number
    income: number
}

export type AnalyticsByPeriodResponse = {
    groupBy: 'day' | 'month'
    dateFrom: string
    dateTo: string
    data: AnalyticsByPeriodItem[]
}

export type ValidationErrors = {
    [key: string]: string[] | undefined
}

export type ApiErrorResponse = {
    error: string | ValidationErrors
}

export type UpdateEmailInput = {
    currentPassword: string
    newEmail: string
}

export type UpdatePasswordInput = {
    currentPassword: string
    newPassword: string
}
