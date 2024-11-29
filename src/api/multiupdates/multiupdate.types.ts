import type { ItemAddData } from '../items/items.types'

export interface MultiPatchItemsData
    extends Partial<Omit<ItemAddData, 'origin_item' | 'order'>> {
    origin_items: string[]
}

export interface MultiPatchOrdersData {
    origin_orders: string[]
    packages?: number
    location?: number
    priority?: number
    production_date?: string
    ship_date?: string | null
    time?: string
}
