import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'

import type { User } from '@/api/users/users.types'
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
import { useQueryState } from 'nuqs'

interface UsersTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading: boolean
}

export const UsersTable = <_, TValue>({
    columns,
    data,
    isLoading
}: UsersTableProps<User, TValue>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableHiding: true,
        enableMultiSort: true
    })

    const [searchTerm] = useQueryState('search', {
        defaultValue: '',
        clearOnDefault: false
    })

    const filteredData = searchTerm ? table
        .getRowModel()
        .rows.filter(
            ({ original: { email, first_name, last_name } }) =>
                email.toLowerCase().includes(searchTerm!) ||
                first_name.toLowerCase().includes(searchTerm!) ||
                last_name.toLowerCase().includes(searchTerm!)
        ) : table
            .getRowModel()
        .rows

    return (
        <ScrollArea className='mt-4 rounded-md border'>
            <Table>
                <TableHeader className='bg-secondary'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    style={{
                                        minWidth: header.column.columnDef.size,
                                        maxWidth: header.column.columnDef.size
                                    }}
                                    key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableSkeleton />
                    ) : filteredData.length ? (
                        filteredData.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        style={{
                                            minWidth: cell.column.columnDef.size,
                                            maxWidth: cell.column.columnDef.size
                                        }}
                                        key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="!bg-transparent">
                            <TableCell
                                colSpan={columns.length}
                                className=" text-left py-8 pl-8 !bg-transparent">
                                No results
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
        </ScrollArea>
    )
}

const TableSkeleton = () => {
    return Array.from({ length: 10 }).map((_, index) => (
        <TableRow
            key={index}>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableCell
                    key={index}
                >
                    <Skeleton className='w-full h-8' />
                </TableCell>
            ))}
        </TableRow>
    ))
}
