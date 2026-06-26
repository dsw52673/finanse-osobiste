'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/app/actions/categories'
import { setCategoryBudgetAction, deleteCategoryBudgetAction } from '@/app/actions/budgets'
import type { Category, BudgetStatusResponse, AnalyticsByCategoryResponse } from '@/lib/api/types'
import { getCleanCategoryName, getCategoryType } from '@/lib/category-helpers'
import { sortCategories } from './utils'
import CategoryForm from './category-form'
import CategoryTable from './category-table'

type CategoryListProps = {
    categories: Category[]
    budgetStatus?: BudgetStatusResponse
    analytics?: AnalyticsByCategoryResponse
}

export default function CategoryList({ categories, budgetStatus, analytics }: CategoryListProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [name, setName] = useState('')
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [categoryType, setCategoryType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const sortedCategories = sortCategories(categories)

    useEffect(() => {
        const total = Math.ceil(sortedCategories.length / 10)
        if (currentPage > total && total > 0) setCurrentPage(total)
    }, [sortedCategories.length, currentPage])

    const handleEditStart = (c: Category) => {
        setError(null)
        setEditingCategory(c)
        setName(getCleanCategoryName(c.name))
        setCategoryType(getCategoryType(c))
    }

    const handleCancel = () => {
        setEditingCategory(null)
        setName('')
        setError(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const trimmedName = name.trim()
        if (!trimmedName) {
            setError('Nazwa kategorii jest wymagana')
            return
        }

        startTransition(async () => {
            const prefix = categoryType === 'INCOME' ? '[Wpływ] ' : '[Wydatek] '
            const res = editingCategory
                ? await updateCategoryAction(editingCategory.id, { name: prefix + trimmedName })
                : await createCategoryAction({ name: prefix + trimmedName })

            if (res.success) {
                setName('')
                setEditingCategory(null)
                setCategoryType('EXPENSE')
                setCurrentPage(1)
                router.refresh()
            } else {
                setError(res.message)
            }
        })
    }

    const handleDelete = (id: number) => {
        setError(null)
        startTransition(async () => {
            const res = await deleteCategoryAction(id)
            if (res.success) {
                setCurrentPage(1)
                router.refresh()
            } else setError(res.message)
        })
    }

    const handleSaveLimit = (categoryId: number, amountStr: string) => {
        setError(null)
        const trimmed = amountStr.trim()

        if (trimmed === '') {
            startTransition(async () => {
                const res = await deleteCategoryBudgetAction(categoryId)
                if (res.success) router.refresh()
                else setError(res.message)
            })
            return
        }

        const parsed = parseFloat(trimmed)
        if (isNaN(parsed) || parsed <= 0) {
            setError('Podaj poprawną kwotę limitu (> 0)')
            return
        }

        startTransition(async () => {
            const res = await setCategoryBudgetAction(categoryId, { amount: parsed })
            if (res.success) router.refresh()
            else setError(res.message)
        })
    }

    return (
        <div className="bg-[#161D30]/80 border border-[#202E4C]/30 rounded-2xl p-6 shadow-xl flex flex-col min-h-[300px]">
            <h3 className="font-bold text-white text-lg mb-4">Lista i zarządzanie kategoriami</h3>
            
            <CategoryForm
                name={name}
                setName={setName}
                editingCategory={editingCategory}
                error={error}
                isPending={isPending}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                categoryType={categoryType}
                setCategoryType={setCategoryType}
            />

            <CategoryTable
                categories={sortedCategories}
                onEdit={handleEditStart}
                onDelete={handleDelete}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                budgetStatus={budgetStatus}
                analytics={analytics}
                onSaveLimit={handleSaveLimit}
            />
        </div>
    )
}
