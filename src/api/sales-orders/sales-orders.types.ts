import type { PrioritiesData } from '../priorities/priorities.types'

import type { PatchPayload, Response } from '@/api/types/query'

export interface SalesOrdersData {
    id: number
    order: string
    priority: PrioritiesData
    packages: number
    location: number
    production_date: string | null
    assigned: boolean
    release_to_production: boolean
    cutting_complete: boolean
}

export type SalesOrdersAddData = Omit<SalesOrdersData, 'id' | 'priority'> & {
    priority: number | null
}

export type SalesOrdersPatchPayload = PatchPayload<SalesOrdersAddData>

export type SalesOrdersResponse = Response<SalesOrdersData>
