import { type Table } from '@tanstack/react-table'

import { ColumnVisibility } from '../../../controls/column-visibility'
import { Pagination } from '../../../controls/pagination'

import type { EBMSItemsData } from '@/api/ebms/ebms.types'

interface TableFooterProps {
    isDataLoading: boolean
    isDataFetching: boolean
    table: Table<EBMSItemsData>
    pageCount: number
}

export const TableFooter: React.FC<TableFooterProps> = ({
    isDataLoading,
    isDataFetching,
    table,
    pageCount
}) => {
    return (
        <div
            className='flex h-14 items-center justify-between gap-4 py-2'
            id='order-pagination'
        >
            <Pagination
                pageCount={pageCount}
                isDataLoading={isDataLoading || isDataFetching}
            />
            <ColumnVisibility
                isDataLoading={isDataLoading || isDataFetching}
                table={table}
                page='items'
            />
        </div>
    )
}
