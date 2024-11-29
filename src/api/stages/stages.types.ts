import type { BaseQueryParams, PatchPayload, Response } from '@/api/types/query'

export interface StageData {
    id: number
    name: string
    description?: string
    position: number
    default?: boolean
    color: string
    flow?: number
}

export interface StageWithItemIds extends StageData {
    item_ids: number[]
}

export interface StagesQueryParams extends BaseQueryParams {
    position: number
    flow: number | null
    search: string
    ordering: string
}

export type StageAddData = Omit<StageData, 'id' | 'position'> & {
    position?: number
}

export type StagePatchPayload = PatchPayload<StageAddData>

export type StagesResponse = Response<StageData>
