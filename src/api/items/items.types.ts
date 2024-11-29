import type { CommentsData } from '../comments/comments.types'
import type { FlowData } from '../flows/flows.types'
import type { PrioritiesData } from '../priorities/priorities.types'
import type { StageWithItemIds } from '../stages/stages.types'

import type { PatchPayload, Response } from '@/api/types/query'

export interface ItemData {
    id: number
    order: number
    origin_item: string
    flow: FlowData
    production_date: string
    time: string
    packages: number
    location: number
    priority: PrioritiesData
    comments: CommentsData[]
    stage: StageWithItemIds | null
}

export interface ItemsPatchCuttingCompleteData {
    autoid: string
    data: {
        cutting_complete: boolean
    }
}

export interface ItemAddData {
    order: string
    origin_item: string
    flow?: number
    priority?: number | null
    time?: string
    location?: number | null
    packages?: number | null
    production_date?: string | null
    stage?: number
    flowName?: string
}

export type ItemPatchPayload = PatchPayload<ItemAddData> & {
    stageName?: string
    stageColor?: string
}
export type ItemsResponse = Response<ItemData>
