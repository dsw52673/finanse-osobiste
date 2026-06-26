import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import authenticate from '../middleware/authenticate'

const router = Router()
const SALT_ROUNDS = 10

const updateEmailSchema = z.object({
    currentPassword: z.string().min(1),
    newEmail: z.string().email()
})

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8)
})

router.use(authenticate)

router.put('/email', async (req: Request, res: Response) => {
    const parsed = updateEmailSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { currentPassword, newEmail } = parsed.data
    const userId = req.userId

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password)

        if (!passwordMatch) {
            res.status(401).json({ error: 'Błędne aktualne hasło' })
            return
        }

        const existingEmail = await prisma.user.findUnique({ where: { email: newEmail } })

        if (existingEmail && existingEmail.id !== userId) {
            res.status(409).json({ error: 'Email jest już w użyciu' })
            return
        }

        await prisma.user.update({
            where: { id: userId },
            data: { email: newEmail }
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji adresu e-mail' })
    }
})

router.put('/password', async (req: Request, res: Response) => {
    const parsed = updatePasswordSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors })
        return
    }

    const { currentPassword, newPassword } = parsed.data
    const userId = req.userId

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password)

        if (!passwordMatch) {
            res.status(401).json({ error: 'Błędne aktualne hasło' })
            return
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji hasła' })
    }
})

export default router
