import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import authenticate from '../middleware/authenticate'

const router = Router()

router.use(authenticate)

const categorySchema = z.object({
    name: z.string().min(1).max(100)
})

router.get('/', async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
        where: {
            OR: [
                { isSystem: true },
                { userId: req.userId! }
            ]
        },
        orderBy: { name: 'asc' }
    })

    res.status(200).json(categories)
})

router.post('/', async (req: Request, res: Response) => {
    const parsed = categorySchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { name } = parsed.data

    const category = await prisma.category.create({
        data: {
            name,
            userId: req.userId!
        }
    })

    res.status(201).json(category)
})

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid id' })
        return
    }

    const existing = await prisma.category.findFirst({
        where: { id, userId: req.userId! }
    })

    if (!existing) {
        res.status(404).json({ error: 'Category not found' })
        return
    }

    if (existing.isSystem) {
        res.status(403).json({ error: 'Cannot modify a system category' })
        return
    }

    const parsed = categorySchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { name } = parsed.data

    const category = await prisma.category.update({
        where: { id },
        data: { name }
    })

    res.status(200).json(category)
})

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid id' })
        return
    }

    const existing = await prisma.category.findFirst({
        where: { id, userId: req.userId! }
    })

    if (!existing) {
        res.status(404).json({ error: 'Category not found' })
        return
    }

    if (existing.isSystem) {
        res.status(403).json({ error: 'Cannot delete a system category' })
        return
    }

    await prisma.category.delete({ where: { id } })

    res.status(204).send()
})

export default router
