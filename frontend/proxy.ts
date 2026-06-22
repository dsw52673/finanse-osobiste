import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const publicPaths = ['/login', '/register']

async function isTokenValid(token: string | undefined): Promise<boolean> {
    const secret = process.env.JWT_SECRET

    if (!secret || !token) {
        return false
    }

    try {
        await jwtVerify(token, new TextEncoder().encode(secret))
        return true
    } catch {
        return false
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value
    const valid = await isTokenValid(token)
    const isPublicPath = publicPaths.includes(pathname)

    if (isPublicPath) {
        if (valid) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        return NextResponse.next()
    }

    if (!valid) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
