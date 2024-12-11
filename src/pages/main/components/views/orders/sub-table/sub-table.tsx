import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useQueryState } from 'nuqs'

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
        getCoreRowModel: getCoreRowModel()
    })

    const [category] = useQueryState('category')

    return (
        <div className='relative max-h-[390px] overflow-y-auto rounded-md !border'>
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
                                            minWidth: header.column.columnDef.size,
                                            maxWidth: header.column.columnDef.size
                                        }}
                                        key={header.id}
                                        className={cn(
                                            'border-gray-300 bg-gray-200',
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
        </div>
    )
}
