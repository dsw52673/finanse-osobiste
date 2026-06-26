import { getCategoriesData, getBudgetStatusData, getAnalyticsByCategoryData } from '@/lib/queries/finance'
import CategoryList from './components/category-list'

export default async function CategoriesPage() {
    const [categories, budgetStatus, analytics] = await Promise.all([
        getCategoriesData(),
        getBudgetStatusData(),
        getAnalyticsByCategoryData()
    ])

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Zarządzanie Kategoriami</h2>
            </div>
            <CategoryList
                categories={categories}
                budgetStatus={budgetStatus}
                analytics={analytics}
            />
        </div>
    )
}


