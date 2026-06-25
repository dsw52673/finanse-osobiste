import { getTransactionsData, getBudgetStatusData, getCategoriesData } from '@/lib/queries/finance'
import { createCategoryAction, deleteCategoryAction } from '@/app/actions/categories'
import Sidebar from './components/sidebar'

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    let [transactions, budgetStatus, categories] = await Promise.all([
        getTransactionsData(),
        getBudgetStatusData(),
        getCategoriesData(),
    ])

    const targetCategories = [
        'Inne',
        'Jedzenie',
        'Paliwo',
        'Subskrypcje',
        'Czynsz',
        'Rozrywka',
        'Wynagrodzenie'
    ]

    const oldDefaults = ['Jedzenie na mieście', 'Zakupy spożywcze', 'Wyjścia ze znajomymi', 'Prezenty']
    const hasOldCategories = categories.some(c => oldDefaults.includes(c.name))
    const hasAllNewCategories = targetCategories.every(name => categories.some(c => c.name === name))

    if (hasOldCategories || !hasAllNewCategories || categories.length === 0) {
        for (const cat of categories) {
            if (oldDefaults.includes(cat.name)) {
                await deleteCategoryAction(cat.id)
            }
        }
        const currentCategories = await getCategoriesData()
        for (const name of targetCategories) {
            if (!currentCategories.some(c => c.name === name)) {
                await createCategoryAction({ name })
            }
        }
        categories = await getCategoriesData()
    }

    let totalIncome = 0
    let totalExpenses = 0

    for (const transaction of transactions) {
        if (transaction.type === 'INCOME') {
            totalIncome += transaction.amount
        } else {
            totalExpenses += transaction.amount
        }
    }

    const availableFunds = totalIncome - totalExpenses
    const monthlyExpenses = budgetStatus.overall.spent

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#0B0F19] text-[#E2E8F0] font-sans antialiased">
            <Sidebar
                availableFunds={availableFunds}
                monthlyExpenses={monthlyExpenses}
                categories={categories}
            />
            <div className="flex-1 flex flex-col min-h-screen">
                <main className="flex-1 p-4 pt-20 md:px-8 md:pb-8 md:pt-24 lg:p-8 w-full max-w-7xl mx-auto flex flex-col">
                    {children}
                </main>
            </div>
        </div>
    )
}

