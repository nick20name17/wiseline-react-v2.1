import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { StringParam, useQueryParam } from 'use-query-params'

import { subSubColumns } from './sub-sub-columns'
import type { EBMSItemData } from '@/api/ebms/ebms.types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { trimOnlyColumns } from '@/config/table'

interface SubSubTableProps {
    data: EBMSItemData[]
}

export const SubSubTable = ({ data }: SubSubTableProps) => {
    const subSubTable = useReactTable({
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        data,
        columns: subSubColumns
    })

    const [category] = useQueryParam('category', StringParam)

    return (
        <div className='relative max-h-[390px] overflow-y-auto rounded-md !border'>
            <Table className='overflow-clip'>
                <TableHeader className='overflow-clip'>
                    {subSubTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            className='!border-b-0 !bg-zinc-300 hover:bg-zinc-300'
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) => {
                                return trimOnlyColumns.includes(header.id) &&
                                    category !== 'Trim' ? null : (
                                    <TableHead
                                        className='shadow-gray-200'
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
                <TableBody className='[&_tr:last-child]:!border-b-0'>
                    {subSubTable.getRowModel().rows.map((row) => (
                        <TableRow key={row?.original?.id}>
                            {row.getVisibleCells().map((cell) =>
                                trimOnlyColumns.includes(cell.column.id) &&
                                category !== 'Trim' ? null : (
                                    <TableCell
                                        style={{
                                            minWidth: cell.column.columnDef.size,
                                            maxWidth: cell.column.columnDef.size
                                        }}
                                        key={cell.id}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
