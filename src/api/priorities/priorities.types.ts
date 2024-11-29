import type { PatchPayload } from '@/api/types/query'

export interface PrioritiesData {
    name: string
    color: string
    position: number
    id: number
}

export type PrioritiesAddData = Omit<PrioritiesData, 'id'>

export type PrioritiesPatchPayload = PatchPayload<PrioritiesAddData>
