import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { AnimatePresence } from 'motion/react'

import { CollapsibleRow } from './collapsible-row'
import type { OrdersData } from '@/api/ebms/ebms.types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { DataTableProps } from '@/types/table'

export const OrdersViewTable = ({
    columns,
    data,
    // isDataLoading,
    // isDataFetching,
    pageCount
}: DataTableProps<OrdersData, OrdersData>) => {
    const table = useReactTable({
        data,
        columns,
        state: {
            columnPinning: {
                left: ['select', 'arrow']
            }
        },
        pageCount,
        enableRowSelection: true,

        getCoreRowModel: getCoreRowModel()
    })

    return (
        <ScrollArea className={cn('h-[440px] rounded-md border')}>
            <Table>
                <TableHeader className='sticky top-0 z-50 bg-background bg-neutral-100'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        className={cn(
                                            header.column.getIsPinned()
                                                ? 'sticky left-0 border-b-0 border-r-0 bg-secondary shadow-[inset_-1px_-1px_0] shadow-border'
                                                : '',
                                            header.column.id === 'arrow' ? 'left-10' : ''
                                        )}
                                        style={{
                                            maxWidth: header.column.columnDef.size,
                                            minWidth: header.column.columnDef.size
                                        }}
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className='[&_tr:last-child]:border-b'>
                    <AnimatePresence initial={false}>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <CollapsibleRow
                                    key={row.original.id}
                                    row={row}
                                />
                            ))
                        ) : (
                            <TableRow className='!bg-transparent'>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 !bg-transparent pl-10 pt-9 text-left'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </AnimatePresence>
                </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
        </ScrollArea>
    )
}
