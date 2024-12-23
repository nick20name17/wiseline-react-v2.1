export interface Response<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export interface PatchPayload<T> {
    id: number | string
    data: Partial<T>
}

export interface BaseQueryParams {
    offset: number
    limit: number
}
