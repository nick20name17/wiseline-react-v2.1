import type { ColumnDef } from '@tanstack/react-table'

import { CheckCell } from '../cell/check-cell'

import type { MergedCuttingItem } from './table'
import { DataTableColumnHeader } from '@/components/shared'

export const columns: ColumnDef<MergedCuttingItem>[] = [
    {
        accessorKey: 'size',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Size'
                sortable={false}
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original?.size || '-'}</div>,
        size: 84
    },
    {
        accessorKey: 'length',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Length'
                sortable={false}
            />
        ),
        cell: ({ row }) => (
            <div className='text-center'>{row.original?.length || '-'}</div>
        ),
        size: 100
    },
    {
        accessorKey: 'total',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Total'
                sortable={false}
            />
        ),
        size: 80
    },
    {
        accessorKey: 'cutting_complete',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Cutting Complete'
                sortable={false}
            />
        ),
        cell: ({ row }) => {
            return (
                <CheckCell
                    autoids={row.original?.autoids}
                    complete={row.original?.cutting_complete}
                />
            )
        },
        size: 164
    }
]
