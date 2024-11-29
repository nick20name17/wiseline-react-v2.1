import type { BaseQueryParams, Response } from '@/api/types/query'

export interface ColorsData {
    values: string[]
}

export interface CuttingItem {
    color: string
    size: number
    length: number
    flow_name: string
    cutting_complete: boolean
    production_date: string
    priority_position: number
    priority_color: string
    priority_name: string
    autoid: string
    gauge: string
    quantity: number
}

export interface CuttingItemQueryParams extends BaseQueryParams {
    color: string | null
    cutting_complete: boolean
    gauge: string | null
}

export type CuttingItemResponse = Response<CuttingItem>
