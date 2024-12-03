import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { useQueryState } from 'nuqs'

import { CollapsibleRow } from './collapsbile-row'
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
    const subTable = useReactTable({
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        data,
        columns: subColumns,
        autoResetPageIndex: false
    })

    const [category] = useQueryState('category')

    const originItemsRows = subTable.getRowModel().rows

    return (
        <Table className='border-t border-neutral-300'>
            <TableHeader>
                {subTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) =>
                            trimOnlyColumns.includes(header.column.id) &&
                            category !== 'Trim' ? null : (
                                <TableHead
                                    style={{
                                        minWidth: header.column.columnDef.size,
                                        maxWidth: header.column.columnDef.size
                                    }}
                                    key={header.id}
                                    className={cn(
                                        'border-neutral-300 bg-neutral-200',

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

            <TableBody>
                {originItemsRows.map((row) =>
                    category === 'Trim' ? (
                        <CollapsibleRow
                            key={row?.original?.id + row.original?.item?.production_date}
                            row={row}
                        />
                    ) : (
                        <TableRow key={row?.original?.id}>
                            {row.getVisibleCells().map((cell) => {
                                return trimOnlyColumns.includes(cell.column.id) &&
                                    category !== 'Trim' ? null : (
                                    <TableCell
                                        style={{
                                            minWidth: cell.column.columnDef.size,
                                            maxWidth: cell.column.columnDef.size
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
    )
}
