import { cookies } from 'next/headers'
import type { ApiErrorResponse } from './types'

function getApiUrl(): string {
    const apiUrl = process.env.API_URL

    if (!apiUrl) {
        throw new Error('API_URL environment variable is not set')
    }

    return apiUrl.replace(/\/+$/, '')
}

export type ApiRequestOptions = Omit<RequestInit, 'headers'> & {
    headers?: HeadersInit
}

export class ApiError extends Error {
    status: number
    data?: ApiErrorResponse

    constructor(message: string, status: number, data?: ApiErrorResponse) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.data = data
    }
}

export async function apiFetch(path: string, options: ApiRequestOptions = {}): Promise<Response> {
    const apiUrl = getApiUrl()
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const headers = new Headers(options.headers)

    if (token) {
        headers.set('Cookie', `token=${token}`)
    }

    return fetch(`${apiUrl}${path}`, {
        ...options,
        headers,
        cache: 'no-store',
    })
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T | undefined> {
    const response = await apiFetch(path, options)

    if (response.status === 204) {
        return undefined
    }

    if (!response.ok) {
        let data: ApiErrorResponse | undefined
        let message = `Request failed with status ${response.status}`

        try {
            const json = await response.json() as unknown

            if (json && typeof json === 'object' && 'error' in json) {
                data = json as ApiErrorResponse
                const error = data.error
                message = typeof error === 'string' ? error : 'Validation failed'
            }
        } catch {
        }

        throw new ApiError(message, response.status, data)
    }

    return await response.json() as T
}
