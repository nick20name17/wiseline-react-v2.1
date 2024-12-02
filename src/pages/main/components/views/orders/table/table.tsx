import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { useRef } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { CollapsibleRow } from './collapsible-row'
import { TableFooter } from './table-footer'
import { TableSkeleton } from '@/components/shared'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { shouldRenderCell } from '@/config/table'
import {
    useColumnDragDrop,
    useColumnOrder,
    useColumnVisibility,
    useCurrentUserRole,
    useMatchMedia,
    useSorting,
    useTableScroll
} from '@/hooks'
import type { OrdersData } from '@/store/api/ebms/ebms.types'
import {
    useAddUsersProfilesMutation,
    useGetUsersProfilesQuery
} from '@/store/api/profiles/profiles'
import type { DataTableProps } from '@/types/table'

export const AllOrdersViewTable: React.FC<DataTableProps<OrdersData, OrdersData>> = ({
    columns,
    data,
    isDataLoading,
    isDataFetching,
    pageCount
}) => {
    const [category] = useQueryParam('category', StringParam)
    const [view] = useQueryParam('view', StringParam)

    const { data: usersProfilesData } = useGetUsersProfilesQuery()
    const [addUsersProfiles] = useAddUsersProfilesMutation()

    const { columnOrder } = useColumnOrder(usersProfilesData!, 'orders')

    const { columnVisibility } = useColumnVisibility(
        usersProfilesData!,
        'orders',
        columns
    )

    const { sorting, setSorting } = useSorting([
        {
            id: 'priority',
            desc: true
        }
    ])

    const table = useReactTable({
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        data,
        columns,
        manualPagination: true,
        manualSorting: true,
        pageCount,
        state: {
            columnVisibility,
            sorting,
            columnOrder
        }
    })

    const { onDragStart, onDrop } = useColumnDragDrop(table, 'orders', addUsersProfiles)

    const tableRef = useRef<HTMLTableElement>(null)

    const { isTablet } = useMatchMedia()

    useTableScroll({
        tableRef,
        enableScroll: !isTablet,
        isCuttingView: view === 'cut'
    })

    const isClientOrWorker = useCurrentUserRole(['client', 'worker'])

    const columnsCount = columns?.length

    return (
        <div className='mt-4'>
            <Table ref={tableRef}>
                <TableHeader>
                    {isDataLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={columnsCount + 1}
                                className='h-[39px] px-1 py-0.5'
                            >
                                <Skeleton className='h-[39px] w-full' />
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, i) =>
                                    shouldRenderCell(
                                        header.column.id,
                                        category!,
                                        isClientOrWorker,
                                        i
                                    ) ? (
                                        <TableHead
                                            className='w-2 border-t-0 !px-1 first:!p-0 last:w-auto [&:nth-child(2)]:!p-0'
                                            draggable={
                                                !table.getState().columnSizingInfo
                                                    .isResizingColumn
                                            }
                                            data-column-index={header.index}
                                            onDragStart={onDragStart}
                                            onDragOver={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                            }}
                                            onDrop={onDrop}
                                            colSpan={header.colSpan}
                                            key={header.id}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ) : null
                                )}
                            </TableRow>
                        ))
                    )}
                </TableHeader>
                <TableBody>
                    {isDataLoading ||
                    (isDataFetching && !table.getRowModel().rows?.length) ? (
                        <TableSkeleton columnsCount={columnsCount} />
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <CollapsibleRow
                                key={row?.original?.id}
                                row={row}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columnsCount + 1}
                                className='h-24 pl-4 text-left'
                            >
                                No results
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TableFooter
                isDataFetching={isDataFetching}
                isDataLoading={isDataLoading}
                table={table}
                pageCount={pageCount}
            />
        </div>
    )
}
