import {
    type Column,
    type Row,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { Calendar, ChevronDown } from 'lucide-react'
import { Fragment, useRef } from 'react'

import { groupByPriority, mergeItems } from '../utils'

import { TableFooter } from './table-footer'
import type { CuttingItem } from '@/api/ebms/cutting/cutting.types'
import { useGetAllFlowsQuery } from '@/api/flows/flows'
import type { FlowData } from '@/api/flows/flows.types'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { TableSkeleton } from '@/components/table-skeleton'
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { useMatchMedia } from '@/hooks/use-match-media'
import { useTableScroll } from '@/hooks/use-table-scroll'
import { cn } from '@/lib/utils'
import type { DataTableProps } from '@/types/table'

export interface MergedCuttingItem {
    color: string
    size: number
    flow_names: { [key: string]: number }
    gauge: string
    quantity: number
    autoids: string[]
    production_date: string
    priority_name: string
    priority_color: string
    length: number
    cutting_complete: boolean
}

type GroupedItems = {
    group: {
        production_date: string
        color: string
        gauge: string
    }
    cuttingItems: Row<MergedCuttingItem>[]
}

const groupByFields = (items: Row<MergedCuttingItem>[]): GroupedItems[] => {
    return items.reduce((groups: GroupedItems[], item: Row<MergedCuttingItem>) => {
        const { production_date, color, gauge } = item.original

        const existingGroup = groups.find(
            (group) =>
                group.group.production_date === production_date &&
                group.group.color === color &&
                group.group.gauge === gauge
        )

        if (existingGroup) {
            existingGroup.cuttingItems.push(item)
        } else {
            groups.push({
                group: { production_date, color, gauge },
                cuttingItems: [item]
            })
        }

        return groups
    }, [])
}

export const CutViewTable = ({
    data,
    isDataLoading,
    isDataFetching,
    columns,
    pageCount
}: DataTableProps<CuttingItem, MergedCuttingItem>) => {
    const { data: trimFlows, isLoading: isLoadingTrimFlows } = useGetAllFlowsQuery({
        category__prod_type: 'Trim'
    })

    const mergedItems = mergeItems(data)

    const trimColumns =
        trimFlows?.map((flow) => ({
            accessorKey: flow.name,
            header: ({ column }: { column: Column<MergedCuttingItem> }) => (
                <DataTableColumnHeader
                    column={column}
                    title={flow.name}
                />
            ),
            cell: () => <div className='text-center'></div>,
            size: 140,
            enableSorting: false
        })) || []

    const allColumns = [...columns]

    allColumns.splice(2, 0, ...trimColumns)

    const table = useReactTable({
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        data: mergedItems,
        columns: allColumns,
        autoResetPageIndex: false,
        enableColumnPinning: true,
        pageCount
    })

    const tableRef = useRef<HTMLTableElement>(null)

    const { isTablet } = useMatchMedia()

    useTableScroll({ tableRef, enableScroll: !isTablet, isCuttingView: true })

    const groupedData = groupByPriority(table.getRowModel().rows || [])
    const colSpan = columns.length + trimColumns.length + 1

    return (
        <div className='overflow-hidden'>
            <div
                ref={tableRef}
                className='relative h-fit overflow-y-auto rounded-md border'
            >
                <Table>
                    <TableBody>
                        {groupedData.length ? (
                            groupedData?.map(({ priority, cuttingItems }) => {
                                const groupedItems = groupByFields(cuttingItems)

                                return isDataLoading || isLoadingTrimFlows ? (
                                    <TableSkeleton columnsCount={allColumns.length} />
                                ) : (
                                    <Fragment key={priority}>
                                        <TableRow className='!p-0'>
                                            <TableCell
                                                className='py-2 pl-7 font-bold'
                                                colSpan={colSpan}
                                            >
                                                <div className='flex items-center gap-x-2'>
                                                    <div
                                                        className='size-4 rounded-sm'
                                                        style={{
                                                            backgroundColor:
                                                                cuttingItems[0]?.original
                                                                    .priority_color
                                                        }}
                                                    ></div>
                                                    Priority: {priority || '-'}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {Object.entries(groupedItems)?.map(
                                            ([key, items]) => {
                                                const { color, gauge, production_date } =
                                                    items.group

                                                return (
                                                    <Collapsible
                                                        key={key}
                                                        asChild
                                                    >
                                                        <>
                                                            <TableRow className='!p-0'>
                                                                <TableCell
                                                                    className='!p-0'
                                                                    colSpan={colSpan}
                                                                >
                                                                    <div className='flex w-full items-center gap-x-2 bg-foreground/5 py-2 pl-5'>
                                                                        <CollapsibleTrigger
                                                                            className='duration-15 transition-transform data-[state=open]:-rotate-90'
                                                                            asChild
                                                                        >
                                                                            <Button
                                                                                className='size-8'
                                                                                variant='ghost'
                                                                                size='icon'
                                                                            >
                                                                                <ChevronDown className='duration-15 size-4 transition-transform' />
                                                                            </Button>
                                                                        </CollapsibleTrigger>

                                                                        <div className='grid w-[490px] grid-cols-3 items-center gap-x-6'>
                                                                            <div className='flex items-center gap-x-2'>
                                                                                <Calendar className='size-4' />
                                                                                {production_date ===
                                                                                'null'
                                                                                    ? '-'
                                                                                    : production_date ||
                                                                                      '-'}
                                                                            </div>
                                                                            <div>
                                                                                Gauge:{' '}
                                                                                {gauge ||
                                                                                    '-'}
                                                                            </div>
                                                                            <div>
                                                                                Color:{' '}
                                                                                {color ||
                                                                                    '-'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <CollapsibleContent asChild>
                                                                <Table>
                                                                    <TableHeader className='bg-background py-0.5'>
                                                                        {isLoadingTrimFlows ? (
                                                                            <TableRow className='p-0'>
                                                                                <TableCell
                                                                                    colSpan={
                                                                                        colSpan
                                                                                    }
                                                                                    className='h-[41px] !px-0 py-1.5'
                                                                                >
                                                                                    <Skeleton className='h-[41px] w-full' />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ) : (
                                                                            table
                                                                                .getHeaderGroups()
                                                                                .map(
                                                                                    (
                                                                                        headerGroup
                                                                                    ) => (
                                                                                        <TableRow
                                                                                            key={
                                                                                                headerGroup.id
                                                                                            }
                                                                                        >
                                                                                            {headerGroup.headers.map(
                                                                                                (
                                                                                                    header
                                                                                                ) => {
                                                                                                    return (
                                                                                                        <TableHead
                                                                                                            key={
                                                                                                                header.id
                                                                                                            }
                                                                                                            style={{
                                                                                                                minWidth:
                                                                                                                    header
                                                                                                                        .column
                                                                                                                        .columnDef
                                                                                                                        .size,
                                                                                                                maxWidth:
                                                                                                                    header
                                                                                                                        .column
                                                                                                                        .columnDef
                                                                                                                        .size
                                                                                                            }}
                                                                                                        >
                                                                                                            {header.isPlaceholder
                                                                                                                ? null
                                                                                                                : flexRender(
                                                                                                                      header
                                                                                                                          .column
                                                                                                                          .columnDef
                                                                                                                          .header,
                                                                                                                      header.getContext()
                                                                                                                  )}
                                                                                                        </TableHead>
                                                                                                    )
                                                                                                }
                                                                                            )}
                                                                                        </TableRow>
                                                                                    )
                                                                                )
                                                                        )}
                                                                    </TableHeader>

                                                                    <TableBody>
                                                                        {items?.cuttingItems?.map(
                                                                            (row) => {
                                                                                return (
                                                                                    <GroupedByColorRow
                                                                                        row={
                                                                                            row
                                                                                        }
                                                                                        trimFlows={
                                                                                            trimFlows ||
                                                                                            []
                                                                                        }
                                                                                    />
                                                                                )
                                                                            }
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </CollapsibleContent>
                                                        </>
                                                    </Collapsible>
                                                )
                                            }
                                        )}
                                    </Fragment>
                                )
                            })
                        ) : isDataFetching ? (
                            <TableSkeleton columnsCount={allColumns.length} />
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={colSpan}
                                    className='h-24 pl-4 text-left'
                                >
                                    No results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <TableFooter
                pageCount={pageCount}
                isDataLoading={isDataLoading}
                isDataFetching={isDataFetching}
            />
        </div>
    )
}

const GroupedByColorRow = ({
    row,
    trimFlows
}: {
    row: Row<MergedCuttingItem>
    trimFlows: FlowData[]
}) => {
    return (
        <TableRow
            key={row.original.autoids[0]}
            className='w-full !p-0 even:bg-secondary/60'
        >
            {row?.getVisibleCells().map((cell) => {
                const trimQuantity = row.original.flow_names

                const trimFlowsNames = trimFlows?.map((flow) => flow.name)

                const trimQuantities =
                    trimFlowsNames?.map((flowName) => trimQuantity[flowName] || 0) || []

                const totalQuantity = trimQuantities.reduce((a, b) => a + b, 0)

                // const isCuttingComplete = cell.column.id === 'cutting_complete'

                return trimFlowsNames?.includes(cell.column.id) ? (
                    <TableCell
                        className='p-1 text-center'
                        key={cell.id}
                    >
                        {trimQuantity[cell.column.id] ?? '-'}
                    </TableCell>
                ) : cell.column.id === 'total' ? (
                    <TableCell
                        className='p-1 text-center'
                        key={cell.id}
                    >
                        {totalQuantity}
                    </TableCell>
                ) : (
                    <TableCell
                        className={cn(
                            'p-1'
                            // isCuttingComplete ? commonPinningStyles : ''
                        )}
                        key={cell.id}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                )
            })}
        </TableRow>
    )
}
