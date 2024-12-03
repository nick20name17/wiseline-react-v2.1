import { type Table } from '@tanstack/react-table'

import { ColumnVisibility } from '../../../controls/column-visibility'
import { Pagination } from '../../../controls/pagination'

import type { OrdersData } from '@/api/ebms/ebms.types'

interface TableFooterProps {
    isDataLoading: boolean
    isDataFetching: boolean
    table: Table<OrdersData>
    pageCount: number
}

export const TableFooter = ({
    isDataLoading,
    isDataFetching,
    table,
    pageCount
}: TableFooterProps) => {
    return (
        <div
            className='flex h-14 items-center justify-between gap-3 py-2'
            id='order-pagination'
        >
            <Pagination
                pageCount={pageCount}
                isDataLoading={isDataLoading || isDataFetching}
            />
            <ColumnVisibility
                isDataLoading={isDataLoading || isDataFetching}
                table={table}
                page='orders'
            />
        </div>
    )
}
