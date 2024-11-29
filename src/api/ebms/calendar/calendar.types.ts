export interface CalendarQueryParams {
    year: number
    month: number
}

interface CapacityData {
    Rollforming: number
    Trim: number
}

export interface DailyDataCategory {
    capacity: number
    count_orders: number
}

interface DailyDataEntry {
    'Standing seam': DailyDataCategory | null
    Rollforming: DailyDataCategory | null
    Trim: DailyDataCategory | null
    Accessories: DailyDataCategory | null
}

interface DailyData {
    [date: string]: DailyDataEntry
}

export type CalendarResponse = DailyData & {
    capacity_data: CapacityData
}
