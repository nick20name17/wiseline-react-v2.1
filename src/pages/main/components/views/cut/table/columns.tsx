import type { ColumnDef } from '@tanstack/react-table'

import { CheckCell } from '../cell/check-cell'

import type { MergedCuttingItem } from './table'
import { DataTableColumnHeader } from '@/components/data-table-column-header'

export const columns: ColumnDef<MergedCuttingItem>[] = [
    {
        accessorKey: 'size',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Size'
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original?.size || '-'}</div>,
        size: 84,
        enableSorting: false
    },
    {
        accessorKey: 'length',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Length'
            />
        ),
        cell: ({ row }) => (
            <div className='text-center'>{row.original?.length || '-'}</div>
        ),
        size: 100,
        enableSorting: false
    },
    {
        accessorKey: 'total',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Total'
            />
        ),
        size: 80,
        enableSorting: false
    },
    {
        accessorKey: 'cutting_complete',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Cutting Complete'
            />
        ),
        cell: ({ row }) => (
            <CheckCell
                autoids={row.original?.autoids}
                complete={row.original?.cutting_complete}
            />
        ),
        size: 164,
        enableSorting: false
    }
]
