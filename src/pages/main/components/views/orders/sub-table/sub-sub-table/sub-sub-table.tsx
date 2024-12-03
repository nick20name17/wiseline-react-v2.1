import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { useQueryState } from 'nuqs'

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

    const [category] = useQueryState('category')

    return (
        <Table className='border-t shadow-neutral-400'>
            <TableHeader className='border-neutral-400 bg-neutral-300'>
                {subSubTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) =>
                            trimOnlyColumns.includes(header.id) &&
                            category !== 'Trim' ? null : (
                                <TableHead
                                    className='shadow-neutral-400'
                                    style={{
                                        minWidth: header.column.columnDef.size,
                                        maxWidth: header.column.columnDef.size
                                    }}
                                    key={header.id}
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

            <TableBody className='[&_tr:last-child]:border'>
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
    )
}
