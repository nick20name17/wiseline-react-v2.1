import type { StageWithItemIds } from '../stages/stages.types'

import type { BaseQueryParams, PatchPayload, Response } from '@/api/types/query'

export interface FlowData {
    id: number
    name: string
    description?: string
    position?: number
    category: string
    created_at?: string
    stages: StageWithItemIds[]
}

export type FlowsAddData = Partial<Omit<FlowData, 'id' | 'stages'>>

export type FlowsPatchPayload = PatchPayload<FlowsAddData>

export type FlowsResponse = Response<FlowData>

export interface FlowsQueryParams extends BaseQueryParams {
    category__prod_type: string
    search: string
    ordering: string
}
