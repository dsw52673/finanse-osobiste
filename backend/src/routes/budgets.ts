import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import authenticate from '../middleware/authenticate'

const router = Router()

router.use(authenticate)

const budgetSchema = z.object({
    amount: z.number().positive(),
    month: z.number().int().min(1).max(12).optional(),
    year: z.number().int().min(2000).optional()
})

router.put('/', async (req: Request, res: Response) => {
    const parsed = budgetSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const now = new Date()
    const { amount, month = now.getMonth() + 1, year = now.getFullYear() } = parsed.data

    const existing = await prisma.budgetLimit.findFirst({
        where: { userId: req.userId!, categoryId: null, month, year }
    })

    const limit = existing
        ? await prisma.budgetLimit.update({
            where: { id: existing.id },
            data: { amount }
        })
        : await prisma.budgetLimit.create({
            data: { amount, month, year, userId: req.userId!, categoryId: null }
        })

    res.status(200).json(limit)
})

router.put('/category/:categoryId', async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params['categoryId'] as string)

    if (isNaN(categoryId)) {
        res.status(400).json({ error: 'Invalid categoryId' })
        return
    }

    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            OR: [
                { userId: req.userId! },
                { isSystem: true }
            ]
        }
    })

    if (!category) {
        res.status(404).json({ error: 'Category not found' })
        return
    }

    const parsed = budgetSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const now = new Date()
    const { amount, month = now.getMonth() + 1, year = now.getFullYear() } = parsed.data

    const limit = await prisma.budgetLimit.upsert({
        where: {
            userId_categoryId_month_year: {
                userId: req.userId!,
                categoryId,
                month,
                year
            }
        },
        update: { amount },
        create: {
            amount,
            month,
            year,
            userId: req.userId!,
            categoryId
        }
    })

    res.status(200).json(limit)
})

router.delete('/category/:categoryId', async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params['categoryId'] as string)

    if (isNaN(categoryId)) {
        res.status(400).json({ error: 'Invalid categoryId' })
        return
    }

    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const existing = await prisma.budgetLimit.findUnique({
        where: {
            userId_categoryId_month_year: {
                userId: req.userId!,
                categoryId,
                month,
                year
            }
        }
    })

    if (!existing) {
        res.status(404).json({ error: 'Budget limit not found' })
        return
    }

    await prisma.budgetLimit.delete({
        where: { id: existing.id }
    })

    res.status(204).send()
})

router.get('/status', async (req: Request, res: Response) => {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const startOfMonth = new Date(year, month - 1, 1)
    const startOfNextMonth = new Date(year, month, 1)

    const [limits, expenses] = await Promise.all([
        prisma.budgetLimit.findMany({
            where: { userId: req.userId!, month, year },
            include: { category: { select: { id: true, name: true } } }
        }),
        prisma.transaction.findMany({
            where: {
                userId: req.userId!,
                type: 'EXPENSE',
                date: {
                    gte: startOfMonth,
                    lt: startOfNextMonth
                }
            },
            select: { amount: true, categoryId: true }
        })
    ])

    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0)

    const spentByCategory = expenses.reduce<Record<number, number>>((acc, t) => {
        if (t.categoryId !== null) {
            acc[t.categoryId] = (acc[t.categoryId] ?? 0) + t.amount
        }
        return acc
    }, {})

    const overallLimit = limits.find(l => l.categoryId === null)
    const categoryLimits = limits.filter(l => l.categoryId !== null)

    const overallLimitAmount = overallLimit?.amount ?? null
    const overallRemaining = overallLimitAmount !== null ? overallLimitAmount - totalSpent : null
    const overallPercentUsed = overallLimitAmount !== null
        ? parseFloat(((totalSpent / overallLimitAmount) * 100).toFixed(2))
        : null

    const categories = categoryLimits.map(l => {
        const spent = spentByCategory[l.categoryId!] ?? 0
        const remaining = l.amount - spent
        const percentUsed = parseFloat(((spent / l.amount) * 100).toFixed(2))

        return {
            categoryId: l.categoryId,
            categoryName: l.category?.name ?? null,
            limit: l.amount,
            spent,
            remaining,
            percentUsed
        }
    })

    res.status(200).json({
        month,
        year,
        overall: {
            limit: overallLimitAmount,
            spent: totalSpent,
            remaining: overallRemaining,
            percentUsed: overallPercentUsed
        },
        categories
    })
})

export default router
