import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { StringParam, useQueryParam } from 'use-query-params'

import { SubCollapsibleRow } from './sub-collapbsible-row'
import { subColumns } from './sub-columns'
import type { EBMSItemsData } from '@/api/ebms/ebms.types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { trimOnlyColumns } from '@/config/table'
import { cn } from '@/lib/utils'

interface SubTableProps {
    data: EBMSItemsData[]
}

export const SubTable = ({ data }: SubTableProps) => {
    const table = useReactTable({
        data,
        columns: subColumns,
        getCoreRowModel: getCoreRowModel(),
        enableColumnResizing: false,
        defaultColumn: {
            minSize: 0,
            size: 0
        }
    })

    const [category] = useQueryParam('category', StringParam)

    return (
        <div className='relative max-h-[390px] overflow-y-auto rounded-md !border shadow-lg'>
            <Table className='overflow-clip'>
                <TableHeader className='overflow-clip'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            className='!border-b-0 !bg-gray-300 hover:bg-gray-200'
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) =>
                                trimOnlyColumns.includes(header.column.id) &&
                                category !== 'Trim' ? null : (
                                    <TableHead
                                        style={{
                                            minWidth:
                                                header.column.columnDef.size !== 0
                                                    ? header.column.columnDef.size
                                                    : undefined,
                                            maxWidth:
                                                header.column.columnDef.size !== 0
                                                    ? header.column.columnDef.size
                                                    : undefined
                                        }}
                                        key={header.id}
                                        className={cn(
                                            'bg-gray-200 shadow-gray-300',
                                            category !== 'Trim' ? 'first:hidden' : ''
                                        )}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                )
                            )}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody className='[&_tr:last-child]:!border-b-0'>
                    {table.getRowModel().rows.map((row) =>
                        category === 'Trim' ? (
                            <SubCollapsibleRow
                                key={
                                    row?.original?.id +
                                    row.original?.item?.production_date
                                }
                                row={row}
                            />
                        ) : (
                            <TableRow key={row?.original?.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return trimOnlyColumns.includes(cell.column.id) &&
                                        category !== 'Trim' ? null : (
                                        <TableCell
                                            style={{
                                                minWidth:
                                                    cell.column.columnDef.size !== 0
                                                        ? cell.column.columnDef.size
                                                        : undefined,
                                                maxWidth:
                                                    cell.column.columnDef.size !== 0
                                                        ? cell.column.columnDef.size
                                                        : undefined
                                            }}
                                            className={cn(
                                                category !== 'Trim' ? 'first:hidden' : ''
                                            )}
                                            key={cell.id}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
