import type { ColumnDef } from '@tanstack/react-table'

export interface DataTableProps<T, C> {
    columns: ColumnDef<C>[]
    data: T[]
    isDataLoading: boolean
    isDataFetching: boolean
    pageCount: number
}
