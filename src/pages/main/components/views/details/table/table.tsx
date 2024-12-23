import {
    type Row,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { BooleanParam, StringParam, useQueryParam, withDefault } from 'use-query-params'

import { TableFooter } from './table-footer'
import type { EBMSItemsData } from '@/api/ebms/ebms.types'
import {
    useAddUsersProfilesMutation,
    useGetUsersProfilesQuery
} from '@/api/profiles/profiles'
import { TableSkeleton } from '@/components/table-skeleton'
import { Checkbox } from '@/components/ui/checkbox'
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
import { fixesColumns, shouldRenderCell } from '@/config/table'
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
import { groupBy } from '@/utils/group-by'

export function DetailsViewTable({
    columns,
    data,
    pageCount,
    isDataLoading,
    isDataFetching
}: DataTableProps<EBMSItemsData, EBMSItemsData>) {
    const [grouped] = useQueryParam('grouped', BooleanParam)
    const [category] = useQueryParam('category', StringParam)
    const [scheduled] = useQueryParam('scheduled', BooleanParam)
    const [completed] = useQueryParam('completed', BooleanParam)

    const { data: usersProfilesData } = useGetUsersProfilesQuery()

    const { columnOrder } = useColumnOrder(usersProfilesData!, 'items')
    const { columnVisibility } = useColumnVisibility(usersProfilesData!, 'items', columns)

    const [addUsersProfiles] = useAddUsersProfilesMutation()

    const defaultSorting = completed
        ? [
              {
                  id: 'production_date',
                  desc: true
              }
          ]
        : [
              {
                  id: 'order',
                  desc: false
              }
          ]

    const { sorting, setSorting } = useSorting(defaultSorting)

    const table = useReactTable({
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        data,
        columns,
        pageCount,
        manualPagination: true,
        manualSorting: true,
        enableHiding: true,
        state: {
            sorting,
            columnVisibility,
            columnOrder,
            columnPinning: {
                left: ['select']
            }
        }
    })

    const { onDragStart, onDrop } = useColumnDragDrop(table, 'items', addUsersProfiles)

    const tableRef = useRef<HTMLTableElement>(null)

    const { isTablet } = useMatchMedia()

    useTableScroll({ tableRef, enableScroll: !isTablet })

    const isClientOrWorker = useCurrentUserRole(['client', 'worker'])

    useLayoutEffect(() => {
        if (grouped) {
            setSorting([{ id: 'order', desc: false }])
        } else if (completed) {
            setSorting([{ id: 'production_date', desc: true }])
        }
    }, [grouped, completed])

    useEffect(() => {
        table.setRowSelection({})
    }, [category, scheduled])

    const groupByOrder = groupBy(table?.getRowModel()?.rows || [], 'original.order')
    const groupByDate = groupBy(
        table?.getRowModel()?.rows || [],
        (row) => row.original?.item?.production_date
    )

    const groupedData = useMemo(
        () => (completed ? groupByDate : groupByOrder),
        [completed, groupByDate, groupByOrder]
    )

    const MotionTableRow = motion(TableRow, {
        forwardMotionProps: true
    })

    const MotionTableCell = motion(TableCell, {
        forwardMotionProps: true
    })

    const [animate, setIsAnimate] = useQueryParam(
        'animate',
        withDefault(StringParam, null),
        {
            removeDefaultsFromUrl: true
        }
    )

    return (
        <div className='mt-4 overflow-clip'>
            <ScrollArea
                ref={tableRef}
                className='rounded-md border'
            >
                {
                    <Table>
                        <TableHeader className='sticky top-0 z-50'>
                            {isDataLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length}>
                                        <Skeleton className='h-5 w-full' />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header, index) => {
                                            const shouldRender = shouldRenderCell(
                                                header.column.id,
                                                category!,
                                                isClientOrWorker,
                                                index
                                            )

                                            if (!shouldRender) {
                                                return null
                                            }

                                            return (
                                                <TableHead
                                                    draggable={
                                                        !table.getState().columnSizingInfo
                                                            .isResizingColumn &&
                                                        !fixesColumns.includes(header.id)
                                                    }
                                                    className={cn(
                                                        header.column.getIsPinned()
                                                            ? 'sticky left-0 z-20 border-b-0 border-r-0 bg-secondary shadow-[inset_-1px_-1px_0] shadow-border'
                                                            : '',
                                                        header.column.id === 'arrow'
                                                            ? 'left-10'
                                                            : ''
                                                    )}
                                                    data-column-index={header.index}
                                                    onDragStart={onDragStart}
                                                    onDragOver={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                    }}
                                                    onDrop={onDrop}
                                                    colSpan={header.colSpan}
                                                    style={{
                                                        minWidth:
                                                            header.column.columnDef.size,
                                                        maxWidth:
                                                            header.column.columnDef.size
                                                    }}
                                                    key={header.id}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef
                                                                  .header,
                                                              header.getContext()
                                                          )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))
                            )}
                        </TableHeader>

                        <TableBody>
                            <AnimatePresence
                                initial={false}
                                onExitComplete={() => setIsAnimate(null)}
                            >
                                {isDataLoading ? (
                                    <TableSkeleton columnsCount={columns.length} />
                                ) : table.getRowModel().rows?.length ? (
                                    grouped || completed ? (
                                        <GroupedRows
                                            groupByOrder={groupedData}
                                            columnsCount={columns?.length + 1}
                                            category={category!}
                                            isClientOrWorker={isClientOrWorker}
                                            shouldRenderCell={shouldRenderCell}
                                            groupKey={
                                                completed ? 'production_date' : 'order'
                                            }
                                        />
                                    ) : (
                                        table.getRowModel().rows.map((row) => {
                                            return (
                                                <MotionTableRow
                                                    layout={
                                                        animate !== null
                                                            ? !!animate
                                                            : false
                                                    }
                                                    id={'tr-' + row.original.id}
                                                    key={row.original.id}
                                                    data-state={
                                                        row.getIsSelected() && 'selected'
                                                    }
                                                >
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell, index) => {
                                                            const shouldRender =
                                                                shouldRenderCell(
                                                                    cell.column.id,
                                                                    category!,
                                                                    isClientOrWorker,
                                                                    index
                                                                )

                                                            if (!shouldRender) {
                                                                return null
                                                            }
                                                            return (
                                                                <MotionTableCell
                                                                    className={cn(
                                                                        cell.column.getIsPinned()
                                                                            ? 'sticky left-0 top-7 z-30 border-r-0 bg-secondary shadow-[inset_-1px_0_0] shadow-border'
                                                                            : ''
                                                                    )}
                                                                    style={{
                                                                        minWidth:
                                                                            cell.column
                                                                                .columnDef
                                                                                .size,
                                                                        maxWidth:
                                                                            cell.column
                                                                                .columnDef
                                                                                .size
                                                                    }}
                                                                    key={cell.id}
                                                                >
                                                                    {flexRender(
                                                                        cell.column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </MotionTableCell>
                                                            )
                                                        })}
                                                </MotionTableRow>
                                            )
                                        })
                                    )
                                ) : isDataFetching ? (
                                    <TableSkeleton columnsCount={columns.length} />
                                ) : (
                                    pageCount === 0 && (
                                        <TableRow className='!bg-transparent'>
                                            <TableCell
                                                colSpan={columns.length}
                                                className='h-24 !bg-transparent pl-10 pt-9 text-left'
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </AnimatePresence>
                        </TableBody>

                        <ScrollBar orientation='horizontal' />
                    </Table>
                }
            </ScrollArea>
            <TableFooter
                isDataFetching={isDataFetching}
                isDataLoading={isDataLoading}
                pageCount={pageCount}
                table={table}
            />
        </div>
    )
}

interface GroupedRowsProps {
    groupByOrder: [string, Row<EBMSItemsData>[]][]
    columnsCount: number
    category: string | null
    isClientOrWorker: boolean
    shouldRenderCell: (
        id: string,
        category: string,
        role: boolean,
        index: number
    ) => boolean
    // onCheckedChange: (value: boolean, group: [string, Row<EBMSItemsData>[]]) => void
    groupKey: 'production_date' | 'order'
}

const GroupedRows = ({
    groupByOrder,
    columnsCount,
    category,
    isClientOrWorker,
    shouldRenderCell,
    groupKey
}: GroupedRowsProps) => {
    const MotionTableRow = motion(TableRow, {
        forwardMotionProps: true
    })

    const MotionTableCell = motion(TableCell, {
        forwardMotionProps: true
    })

    const [animate] = useQueryParam('animate', withDefault(StringParam, null), {
        removeDefaultsFromUrl: true
    })

    return groupByOrder.map((group) =>
        group[1].map((row, index) => {
            const isIndeterminate =
                group[1].some((row) => row.getIsSelected()) &&
                !group[1].every((row) => row.getIsSelected())
                    ? 'indeterminate'
                    : group[1].every((row) => row.getIsSelected())

            return (
                <Fragment key={`${group[0]}-${row.original.id}-${index}`}>
                    {index === 0 && (
                        <MotionTableRow
                            layout={animate !== null ? !!animate : false}
                            id={'tr-header-' + row.original?.id}
                            className='!p-0'
                        >
                            <MotionTableCell
                                colSpan={columnsCount}
                                className='!p-0'
                            >
                                <div className='!m-0 flex h-8 items-center !bg-gray-300 text-sm'>
                                    <div className='sticky left-0 flex h-full w-10 items-center justify-center !bg-gray-300 shadow-[inset_-1px_0_0] shadow-border'>
                                        <Checkbox
                                            checked={isIndeterminate}
                                            value={row.id}
                                            onCheckedChange={(value) => {
                                                group[1].forEach((row) =>
                                                    row.toggleSelected(!!value)
                                                )
                                            }}
                                            aria-label='Select row'
                                        />
                                    </div>
                                    <div className='pl-4'>
                                        {groupKey === 'production_date' ? (
                                            group[1][0].original?.item
                                                ?.production_date ? (
                                                format(
                                                    group[1][0].original?.item
                                                        ?.production_date || '',
                                                    'dd.MM.yyyy EEE'
                                                )
                                            ) : (
                                                '-'
                                            )
                                        ) : (
                                            <>
                                                {group[0]} |{' '}
                                                {group[1][0].original?.customer}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </MotionTableCell>
                        </MotionTableRow>
                    )}
                    <MotionTableRow
                        id={'tr-' + row.original?.id}
                        layout={animate !== null ? !!animate : false}
                        className='even:bg-secondary/60'
                        data-state={row.getIsSelected() && 'selected'}
                    >
                        {row.getVisibleCells().map((cell, i) => {
                            const shouldRender = shouldRenderCell(
                                cell.column.id,
                                category!,
                                isClientOrWorker,
                                i
                            )

                            if (!shouldRender) {
                                return null
                            }

                            return (
                                <MotionTableCell
                                    layout={animate !== null ? !!animate : false}
                                    style={{
                                        minWidth: cell.column.columnDef.size,
                                        maxWidth: cell.column.columnDef.size
                                    }}
                                    className={cn(
                                        'first:p-0',
                                        cell.column.getIsPinned()
                                            ? 'sticky left-0 top-7 z-30 border-r-0 bg-secondary shadow-[inset_-1px_0_0] shadow-border'
                                            : ''
                                    )}
                                    key={cell.id}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </MotionTableCell>
                            )
                        })}
                    </MotionTableRow>
                </Fragment>
            )
        })
    )
}
