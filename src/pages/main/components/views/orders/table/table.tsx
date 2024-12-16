import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { memo, useCallback, useMemo, useRef } from 'react'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'

import { CollapsibleGroupedRows, CollapsibleRow } from './collapsible-row'
import { TableFooter } from './table-footer'
import type { OrdersData } from '@/api/ebms/ebms.types'
import {
    useAddUsersProfilesMutation,
    useGetUsersProfilesQuery
} from '@/api/profiles/profiles'
import { TableSkeleton } from '@/components/table-skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
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
    useColumnVisibility
} from '@/hooks/use-column-controls'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'
import { useMatchMedia } from '@/hooks/use-match-media'
import { useSorting } from '@/hooks/use-sorting'
import { useTableScroll } from '@/hooks/use-table-scroll'
import { cn } from '@/lib/utils'
import type { DataTableProps } from '@/types/table'
import { groupByDate } from '@/utils/group-by'

const OrdersViewTable = memo(
    ({
        columns,
        data,
        isDataLoading,
        isDataFetching,
        pageCount
    }: DataTableProps<OrdersData, OrdersData>) => {
        const [category] = useQueryParam('category', StringParam)
        const [view] = useQueryParam('view', StringParam)
        const [completed] = useQueryParam('completed', BooleanParam)

        const { data: usersProfilesData } = useGetUsersProfilesQuery()
        const [addUsersProfiles] = useAddUsersProfilesMutation()

        const { columnOrder } = useColumnOrder(usersProfilesData!, 'orders')
        const { columnVisibility } = useColumnVisibility(
            usersProfilesData!,
            'orders',
            columns
        )
        const { sorting, setSorting } = useSorting([
            { id: completed ? 'priority' : 'production_date', desc: true }
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
            enableColumnResizing: false,
            state: {
                columnVisibility,
                sorting,
                columnOrder,
                columnPinning: { left: ['select', 'arrow'] }
            },
            defaultColumn: {
                minSize: 0,
                size: 0
            }
        })

        const { onDragStart, onDrop } = useColumnDragDrop(
            table,
            'orders',
            addUsersProfiles
        )

        const tableRef = useRef<HTMLTableElement>(null)
        const { isTablet } = useMatchMedia()

        useTableScroll({
            tableRef,
            enableScroll: !isTablet,
            isCuttingView: view === 'cut'
        })

        const isClientOrWorker = useCurrentUserRole(['client', 'worker'])

        const groupData = useMemo(
            () =>
                groupByDate(
                    table?.getRowModel()?.rows || [],
                    (row) => row.original?.sales_order?.production_date || ''
                ),
            [table?.getRowModel()?.rows]
        )

        const renderHeader = useCallback(() => {
            if (isDataLoading) {
                return (
                    <TableRow>
                        <TableCell colSpan={columns.length}>
                            <Skeleton className='h-5 w-full' />
                        </TableCell>
                    </TableRow>
                )
            }

            return table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) =>
                        shouldRenderCell(
                            header.column.id,
                            category!,
                            isClientOrWorker,
                            i
                        ) ? (
                            <TableHead
                                key={header.id}
                                className={cn(
                                    header.column.getIsPinned()
                                        ? 'sticky left-0 border-b-0 border-r-0 bg-secondary shadow-[inset_-1px_-1px_0] shadow-border'
                                        : '',
                                    header.column.id === 'arrow' ? 'left-10' : ''
                                )}
                                style={{
                                    maxWidth:
                                        header.column.columnDef.size !== 0
                                            ? header.column.columnDef.size
                                            : undefined,
                                    minWidth:
                                        header.column.columnDef.size !== 0
                                            ? header.column.columnDef.size
                                            : undefined,
                                    width:
                                        header.column.columnDef.size !== 0
                                            ? header.column.columnDef.size
                                            : undefined
                                }}
                                colSpan={header.colSpan}
                                draggable={
                                    !table.getState().columnSizingInfo.isResizingColumn
                                }
                                data-column-index={header.index}
                                onDragStart={onDragStart}
                                onDragOver={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                }}
                                onDrop={onDrop}
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
        }, [
            isDataLoading,
            table,
            category,
            isClientOrWorker,
            columns.length,
            onDragStart,
            onDrop
        ])

        const renderBody = useCallback(() => {
            if (isDataLoading) {
                return <TableSkeleton columnsCount={columns.length} />
            }

            if (table.getRowModel().rows?.length) {
                return completed ? (
                    <CollapsibleGroupedRows groupByDate={groupData} />
                ) : (
                    table.getRowModel().rows.map((row, index) => (
                        <CollapsibleRow
                            index={index}
                            key={row.original.id}
                            row={row}
                        />
                    ))
                )
            }

            if (isDataFetching) {
                return <TableSkeleton columnsCount={columns.length} />
            }

            return (
                <TableRow className='!bg-transparent'>
                    <TableCell
                        colSpan={columns.length}
                        className='h-24 !bg-transparent pl-10 pt-9 text-left'
                    >
                        No results.
                    </TableCell>
                </TableRow>
            )
        }, [isDataLoading, isDataFetching, table, completed, groupData, columns])

        return (
            <>
                <ScrollArea
                    ref={tableRef}
                    className={cn('mt-4 rounded-md border')}
                >
                    <Table>
                        <TableHeader className='sticky top-0 z-40 bg-background bg-gray-100'>
                            {renderHeader()}
                        </TableHeader>
                        <TableBody className='[&_tr:last-child]:!border-b-0'>
                            {renderBody()}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation='horizontal' />
                </ScrollArea>

                <TableFooter
                    isDataFetching={isDataFetching}
                    isDataLoading={isDataLoading}
                    pageCount={pageCount}
                    table={table}
                />
            </>
        )
    }
)

export { OrdersViewTable }
