import type { ColumnDef } from '@tanstack/react-table'

import { CommentsCell } from '../../../cells/comments-cell'
import { FlowCell } from '../../../cells/flow-cell'
import { OnHandCell } from '../../../cells/on-hand-cell'
import { StatusCell } from '../../../cells/status-cell'
import { CheckboxCell } from '../cells/checkbox-cell'
import { CheckboxHeader } from '../cells/checkbox-header'
import { DatePickerCell } from '../cells/date-picker-cell'

import type { EBMSItemsData } from '@/api/ebms/ebms.types'
import { DataTableColumnHeader } from '@/components/data-table-column-header'

export const columns: ColumnDef<EBMSItemsData>[] = [
    {
        id: 'select',
        header: ({ table }) => <CheckboxHeader table={table} />,
        cell: ({ row }) => <CheckboxCell row={row} />,
        enableSorting: false,
        enableHiding: false,
        size: 40
    },
    {
        accessorKey: 'flow',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Flow/Machine'
            />
        ),
        cell: ({ row }) => {
            return (
                <FlowCell
                    key={row?.original?.id}
                    item={row.original}
                />
            )
        },
        enableHiding: false,
        size: 158
    },
    {
        accessorKey: 'status',
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
        enableHiding: false,
        size: 158
    },
    {
        accessorKey: 'production_date',
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
        enableHiding: false,
        size: 160
    },
    {
        accessorKey: 'order',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Order'
            />
        ),
        cell: ({ row }) => <div>{row.original.order || '-'}</div>,
        size: 82
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Ordered'
            />
        ),
        cell: ({ row }) => (
            <div className='text-center'>{row.original.quantity || '-'}</div>
        ),
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
        cell: ({ row }) => (
            <div className='text-center'>{row.original.shipped || '-'}</div>
        ),
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
        cell: ({ row }) => <div>{row.original.profile || '-'}</div>,
        size: 112
    },
    {
        accessorKey: 'id_inven',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='ID'
            />
        ),
        size: 132
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
                cellKey='items'
                disabled={row.original?.c_type !== 2}
                originItem={row?.original}
            />
        ),
        size: 80
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
        size: 80
    },
    {
        accessorKey: 'weight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Weight'
            />
        ),
        cell: ({ row }) => (
            <div className='text-center'>{row.original.weight || '-'}</div>
        ),
        size: 84
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
        size: 84
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
        size: 84
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            ;<DataTableColumnHeader
                column={column}
                title=''
            />
        },
        size: 256,
        enableSorting: false
    },
    {
        accessorKey: 'comments',
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
