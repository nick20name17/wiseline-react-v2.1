import type { PatchPayload, Response } from '@/api/types/query'

export interface CapacitiesData {
    id: number
    category: string
    per_day: number
}

export type CapacitiesAddData = Omit<CapacitiesData, 'id'>

export type CapacitiesPatchPayload = PatchPayload<CapacitiesAddData>

export type CapacitiesResponse = Response<CapacitiesData>
