import { getTransactionsData, getBudgetStatusData, getAnalyticsByCategoryData } from '@/lib/queries/finance'
import MonthlyOverview from './components/monthly-overview'
import BudgetLimitCard from './components/budget-limit-card'
import CategoryExpensesCard from './components/category-expenses-card'
import RecentTransactions from './components/recent-transactions'

export default async function DashboardPage() {
    const [transactions, budgetStatus, analytics] = await Promise.all([
        getTransactionsData(),
        getBudgetStatusData(),
        getAnalyticsByCategoryData(),
    ])

    return (
        <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-3 gap-6">
                <div className="md:col-span-3 xl:col-span-1 h-full">
                    <MonthlyOverview transactions={transactions} overallBudget={budgetStatus.overall} />
                </div>
                <div className="md:col-span-3 xl:col-span-1 h-full">
                    <BudgetLimitCard budgetStatus={budgetStatus} />
                </div>
                <div className="md:col-span-2 xl:col-span-1 h-full">
                    <CategoryExpensesCard analytics={analytics} />
                </div>
                <div className="md:col-span-4 xl:col-span-3 h-full">
                    <RecentTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    )
}

