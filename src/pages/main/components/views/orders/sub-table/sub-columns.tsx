import type { ColumnDef } from '@tanstack/react-table'
import { useQueryState } from 'nuqs'

import { CommentsCell } from '../../../cells/comments-cell'
import { FlowCell } from '../../../cells/flow-cell'
import { OnHandCell } from '../../../cells/on-hand-cell'
import { StatusCell } from '../../../cells/status-cell'
import { DatePickerCell } from '../../details/cells/date-picker-cell'
import { CollapsibleCell } from '../cells/collapsible-cell'

import { dateFn, flowFn, notesFn, statusFn } from './sorting'
import type { EBMSItemsData } from '@/api/ebms/ebms.types'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { Button } from '@/components/ui/button'

export const subColumns: ColumnDef<EBMSItemsData>[] = [
    {
        id: 'arrow',
        header: ({ column }) => {
            const [category] = useQueryState('category')

            return category === 'Trim' ? (
                <DataTableColumnHeader
                    column={column}
                    title=''
                />
            ) : null
        },
        cell: ({ row }) => {
            const [category] = useQueryState('category')

            return category === 'Trim' ? (
                <CollapsibleCell disabled={!row.original?.cutting_items?.length} />
            ) : null
        },
        enableHiding: false,
        enableSorting: false,
        size: 48
    },
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
        accessorKey: 'flow',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Flow/Machine'
            />
        ),
        sortingFn: flowFn,
        cell: ({ row }) => <FlowCell item={row.original} />,
        size: 144
    },
    {
        accessorKey: 'status',
        sortingFn: statusFn,
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Status'
            />
        ),
        cell: ({ row }) => (
            <StatusCell
                key={row?.original?.id}
                item={row.original}
            />
        ),
        size: 144
    },
    {
        accessorKey: 'production_date',
        sortingFn: dateFn,
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Prod. date'
            />
        ),
        cell: ({ row }) => (
            <DatePickerCell
                key={row.original?.id}
                originItem={row.original}
            />
        ),
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
        accessorKey: 'shipped',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Shipped'
            />
        ),
        cell: ({ row }) => <div className='text-center'>{row.original.shipped}</div>,
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
        cell: ({ row }) => <div className='text-center'>{row.original.color || '-'}</div>,
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
        cell: ({ row }) => (
            <div className='w-28 text-center'>{row.original.gauge || '-'}</div>
        ),
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
        accessorKey: 'c_mfg',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='MFG'
            />
        ),
        cell: ({ row }) => (
            <OnHandCell
                cellKey='orders'
                disabled={row.original?.c_type !== 2}
                originItem={row?.original}
            />
        ),
        size: 96
    },
    {
        accessorKey: 'on_hand',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='On hand'
            />
        ),
        cell: ({ row }) => (
            <div className='text-center'>{row.original?.on_hand ?? '-'}</div>
        ),
        size: 96
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
    },
    {
        accessorKey: 'comments',
        sortingFn: notesFn,
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Notes'
            />
        ),
        cell: ({ row }) => <CommentsCell originItem={row.original} />,
        size: 128
    }
]
