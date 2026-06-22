import { apiRequest } from './client'
import type {
    AnalyticsByCategoryParams,
    AnalyticsByCategoryResponse,
    AnalyticsByPeriodParams,
    AnalyticsByPeriodResponse,
} from './types'

function requireResult<T>(result: T | undefined, message: string): T {
    if (result === undefined) {
        throw new Error(message)
    }

    return result
}

function buildByCategoryQueryString(params?: AnalyticsByCategoryParams): string {
    if (!params) {
        return ''
    }

    const searchParams = new URLSearchParams()

    if (params.month !== undefined) {
        searchParams.set('month', String(params.month))
    }

    if (params.year !== undefined) {
        searchParams.set('year', String(params.year))
    }

    const query = searchParams.toString()

    return query ? `?${query}` : ''
}

function buildByPeriodQueryString(params?: AnalyticsByPeriodParams): string {
    if (!params) {
        return ''
    }

    const searchParams = new URLSearchParams()

    if (params.groupBy !== undefined) {
        searchParams.set('groupBy', params.groupBy)
    }

    if (params.dateFrom !== undefined) {
        searchParams.set('dateFrom', params.dateFrom)
    }

    if (params.dateTo !== undefined) {
        searchParams.set('dateTo', params.dateTo)
    }

    const query = searchParams.toString()

    return query ? `?${query}` : ''
}

export async function getAnalyticsByCategory(
    params?: AnalyticsByCategoryParams,
): Promise<AnalyticsByCategoryResponse> {
    return requireResult(
        await apiRequest<AnalyticsByCategoryResponse>(
            `/api/analytics/by-category${buildByCategoryQueryString(params)}`,
        ),
        'Empty response from analytics by category endpoint',
    )
}

export async function getAnalyticsByPeriod(
    params?: AnalyticsByPeriodParams,
): Promise<AnalyticsByPeriodResponse> {
    return requireResult(
        await apiRequest<AnalyticsByPeriodResponse>(
            `/api/analytics/by-period${buildByPeriodQueryString(params)}`,
        ),
        'Empty response from analytics by period endpoint',
    )
}
