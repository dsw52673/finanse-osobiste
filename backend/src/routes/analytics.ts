import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import authenticate from '../middleware/authenticate'

const router = Router()

router.use(authenticate)

const byCategoryQuerySchema = z.object({
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2000).optional()
})

const byPeriodQuerySchema = z.object({
    groupBy: z.enum(['day', 'month']).default('month'),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional()
})

router.get('/by-category', async (req: Request, res: Response) => {
    const parsed = byCategoryQuerySchema.safeParse(req.query)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const now = new Date()
    const { month = now.getMonth() + 1, year = now.getFullYear() } = parsed.data

    const startOfMonth = new Date(year, month - 1, 1)
    const startOfNextMonth = new Date(year, month, 1)

    const expenses = await prisma.transaction.findMany({
        where: {
            userId: req.userId!,
            type: 'EXPENSE',
            date: {
                gte: startOfMonth,
                lt: startOfNextMonth
            }
        },
        select: {
            amount: true,
            categoryId: true,
            category: {
                select: { name: true }
            }
        }
    })

    const grouped = expenses.reduce<Record<string, number>>((acc, t) => {
        const key = t.category?.name ?? 'Bez kategorii'
        acc[key] = (acc[key] ?? 0) + t.amount
        return acc
    }, {})

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

    const data = Object.entries(grouped).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
    }))

    res.status(200).json({
        month,
        year,
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        data
    })
})

router.get('/by-period', async (req: Request, res: Response) => {
    const parsed = byPeriodQuerySchema.safeParse(req.query)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { groupBy, dateFrom, dateTo } = parsed.data

    const now = new Date()
    const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const from = dateFrom ? new Date(dateFrom) : defaultFrom
    const to = dateTo ? new Date(dateTo) : now

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: req.userId!,
            date: {
                gte: from,
                lte: to
            }
        },
        select: {
            amount: true,
            type: true,
            date: true
        }
    })

    const grouped = transactions.reduce<Record<string, { expenses: number; income: number }>>(
        (acc, t) => {
            const d = new Date(t.date)
            const period =
                groupBy === 'day'
                    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

            if (!acc[period]) {
                acc[period] = { expenses: 0, income: 0 }
            }

            if (t.type === 'EXPENSE') {
                acc[period].expenses += t.amount
            } else {
                acc[period].income += t.amount
            }

            return acc
        },
        {}
    )

    const data = Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([period, values]) => ({
            period,
            expenses: parseFloat(values.expenses.toFixed(2)),
            income: parseFloat(values.income.toFixed(2))
        }))

    res.status(200).json({
        groupBy,
        dateFrom: from.toISOString().slice(0, 10),
        dateTo: to.toISOString().slice(0, 10),
        data
    })
})

export default router
