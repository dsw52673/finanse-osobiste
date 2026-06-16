import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import authenticate from '../middleware/authenticate'

const router = Router()

router.use(authenticate)

const transactionSchema = z.object({
    amount: z.number().positive(),
    currency: z.string().length(3).default('PLN'),
    type: z.enum(['INCOME', 'EXPENSE']),
    description: z.string().optional(),
    date: z.string().min(1),
    categoryId: z.number().int().positive().nullish()
})

const listQuerySchema = z.object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    categoryId: z.coerce.number().int().positive().optional()
})

const importSchema = z.array(
    z.object({
        amount: z.number().positive(),
        currency: z.string().length(3).default('PLN'),
        type: z.enum(['INCOME', 'EXPENSE']),
        description: z.string().optional(),
        date: z.string().min(1),
        categoryId: z.number().int().positive().nullish()
    })
).min(1).max(500)

router.get('/', async (req: Request, res: Response) => {
    const parsed = listQuerySchema.safeParse(req.query as Record<string, string>)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { dateFrom, dateTo, type, categoryId } = parsed.data

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: req.userId!,
            type: type ?? undefined,
            categoryId: categoryId ?? undefined,
            ...(dateFrom || dateTo
                ? {
                    date: {
                        ...(dateFrom && { gte: new Date(dateFrom) }),
                        ...(dateTo && { lte: new Date(dateTo) })
                    }
                }
                : {})
        },
        include: {
            category: {
                select: { id: true, name: true }
            }
        },
        orderBy: { date: 'desc' }
    })

    res.status(200).json(transactions)
})

router.post('/', async (req: Request, res: Response) => {
    const parsed = transactionSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { amount, currency, type, description, date, categoryId } = parsed.data

    if (categoryId) {
        const category = await prisma.category.findFirst({
            where: { id: categoryId, userId: req.userId! }
        })

        if (!category) {
            res.status(404).json({ error: 'Category not found' })
            return
        }
    }

    const transaction = await prisma.transaction.create({
        data: {
            amount,
            currency,
            type,
            description,
            date: new Date(date),
            userId: req.userId!,
            categoryId: categoryId ?? null
        },
        include: {
            category: {
                select: { id: true, name: true }
            }
        }
    })

    res.status(201).json(transaction)
})

router.post('/import', async (req: Request, res: Response) => {
    const parsed = importSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const items = parsed.data

    const categoryIds = [
        ...new Set(
            items.map((item) => item.categoryId).filter((id): id is number => id != null)
        )
    ]

    if (categoryIds.length > 0) {
        const ownedCategories = await prisma.category.findMany({
            where: { id: { in: categoryIds }, userId: req.userId! },
            select: { id: true }
        })

        const ownedIds = new Set(ownedCategories.map((c) => c.id))
        const invalid = categoryIds.filter((id) => !ownedIds.has(id))

        if (invalid.length > 0) {
            res.status(400).json({ error: `Category ids not found or not owned: ${invalid.join(', ')}` })
            return
        }
    }

    const data = items.map((item) => ({
        amount: item.amount,
        currency: item.currency,
        type: item.type,
        description: item.description ?? null,
        date: new Date(item.date),
        userId: req.userId!,
        categoryId: item.categoryId ?? null
    }))

    const result = await prisma.transaction.createMany({ data })

    res.status(201).json({ count: result.count })
})

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid id' })
        return
    }

    const transaction = await prisma.transaction.findFirst({
        where: { id, userId: req.userId! },
        include: {
            category: {
                select: { id: true, name: true }
            }
        }
    })

    if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' })
        return
    }

    res.status(200).json(transaction)
})

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid id' })
        return
    }

    const existing = await prisma.transaction.findFirst({
        where: { id, userId: req.userId! }
    })

    if (!existing) {
        res.status(404).json({ error: 'Transaction not found' })
        return
    }

    const parsed = transactionSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { amount, currency, type, description, date, categoryId } = parsed.data

    if (categoryId) {
        const category = await prisma.category.findFirst({
            where: { id: categoryId, userId: req.userId! }
        })

        if (!category) {
            res.status(404).json({ error: 'Category not found' })
            return
        }
    }

    const transaction = await prisma.transaction.update({
        where: { id },
        data: {
            amount,
            currency,
            type,
            description,
            date: new Date(date),
            categoryId: categoryId ?? null
        },
        include: {
            category: {
                select: { id: true, name: true }
            }
        }
    })

    res.status(200).json(transaction)
})

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid id' })
        return
    }

    const existing = await prisma.transaction.findFirst({
        where: { id, userId: req.userId! }
    })

    if (!existing) {
        res.status(404).json({ error: 'Transaction not found' })
        return
    }

    await prisma.transaction.delete({ where: { id } })

    res.status(204).send()
})

export default router
