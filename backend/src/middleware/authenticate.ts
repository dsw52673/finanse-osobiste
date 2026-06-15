import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
    userId: number
    email: string
}

declare global {
    namespace Express {
        interface Request {
            userId?: number
            userEmail?: string
        }
    }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token

    if (!token) {
        res.status(401).json({ error: 'Not authenticated' })
        return
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        req.userId = payload.userId
        req.userEmail = payload.email
        next()
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' })
    }
}

export default authenticate
