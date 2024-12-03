import type { ColumnDef } from '@tanstack/react-table'

import type { EBMSItemData } from '@/api/ebms/ebms.types'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { Button } from '@/components/ui/button'

export const subSubColumns: ColumnDef<EBMSItemData>[] = [
    {
        accessorKey: 'category',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Prod. category'
            />
        ),
        enableHiding: false,
        size: 160
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Ordered'
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original.quantity}</div>,
        sortingFn: 'alphanumeric',
        size: 112
    },
    {
        accessorKey: 'color',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Color'
            />
        ),
        cell: ({ row }) => <div>{row.original.color || '-'}</div>,
        size: 112
    },
    {
        accessorKey: 'gauge',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Gauge'
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original.gauge || '-'}</div>,
        size: 112
    },
    {
        accessorKey: 'profile',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Profile'
            />
        ),
        cell: ({ row }) => (
            <div className='text-center'>{row.original.profile || '-'}</div>
        ),
        size: 112
    },
    {
        accessorKey: 'customer',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Customer'
            />
        ),
        cell: ({ row }) => <div>{row.original.customer || '-'}</div>,
        size: 250
    },
    {
        accessorKey: 'id_inven',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='ID'
            />
        ),
        size: 112
    },
    {
        accessorKey: 'bends',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Bends'
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original?.bends}</div>,
        sortingFn: 'alphanumeric',
        size: 112
    },
    {
        accessorKey: 'weight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Weight'
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original?.weight}</div>,
        sortingFn: 'alphanumeric',
        size: 112
    },
    {
        accessorKey: 'width',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Width'
            />
        ),
        cell: ({ row }) => (
            <div className='text-center'>{row.original?.width || '-'}</div>
        ),
        size: 112
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
        size: 112
    },
    {
        accessorKey: 'description',
        header: () => (
            <Button
                variant='ghost'
                className='size-full justify-start rounded-none px-1.5'
            >
                Description
            </Button>
        ),
        cell: ({ row }) => <div>{row.original?.description}</div>,
        size: 250
    }
]
