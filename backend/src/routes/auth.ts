import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const router = Router()

const SALT_ROUNDS = 10

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})

router.post('/register', async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
        res.status(409).json({ error: 'Email already in use' })
        return
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await prisma.user.create({
        data: { email, password: hashedPassword },
        select: { id: true, email: true, createdAt: true }
    })

    res.status(201).json(user)
})

router.post('/login', async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    )

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ id: user.id, email: user.email })
})

export default router
