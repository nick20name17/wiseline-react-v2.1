import { type Row, flexRender } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Fragment, useState } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { getCommonPinningStyles } from '../../cut-view/utils'
import { SubTable } from '../sub-table/sub-table'

import { columns } from './columns'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { TableCell, TableRow } from '@/components/ui/table'
import { shouldRenderCell } from '@/config/table'
import { useCurrentUserRole, useMatchMedia } from '@/hooks'
import { cn } from '@/lib/utils'
import type { OrdersData } from '@/store/api/ebms/ebms.types'

interface GroupedRowsProps {
    originRow: Row<OrdersData>
    groupByDate: [string, Row<OrdersData>[]][]
}

export const CollapsibleGroupedRows: React.FC<GroupedRowsProps> = ({ groupByDate }) => {
    const columnsCount = columns.length

    return groupByDate.map((group) =>
        group[1].map((row, index) => {
            const isIndeterminate =
                group[1].some((row) => row.getIsSelected()) &&
                !group[1].every((row) => row.getIsSelected())
                    ? 'indeterminate'
                    : group[1].every((row) => row.getIsSelected())

            return (
                <Fragment key={group[1][0].original.id}>
                    {index === 0 && (
                        <TableRow
                            id={'tr-group=header-' + row.original?.id}
                            className='bg-secondary !p-0'
                        >
                            <TableCell
                                colSpan={columnsCount}
                                className='!p-0'
                            >
                                <div className='!m-0 flex h-9 items-center bg-[#E6E6E6]'>
                                    <div className='sticky left-0 z-50 flex h-full w-10 items-center justify-center bg-[#E6E6E6]'>
                                        <Checkbox
                                            checked={isIndeterminate}
                                            value={row.id}
                                            onCheckedChange={(value) => {
                                                group[1].forEach((row) =>
                                                    row.toggleSelected(!!value)
                                                )
                                            }}
                                            aria-label='Select row'
                                        />
                                    </div>
                                    <div className='pl-4'>
                                        {group[1][0].original?.sales_order
                                            ?.production_date
                                            ? format(
                                                  group[1][0].original?.sales_order
                                                      ?.production_date || '',
                                                  'dd.MM.yyyy EEE'
                                              )
                                            : '-'}
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    <CollapsibleRow row={group[1][0]} />
                </Fragment>
            )
        })
    )
}

interface CollapsibleRowProps {
    row: Row<OrdersData>
}

export const CollapsibleRow: React.FC<CollapsibleRowProps> = ({ row }) => {
    const [category] = useQueryParam('category', StringParam)
    const [open, setOpen] = useState(false)

    const { isTablet } = useMatchMedia()

    const originItems = row.original.origin_items
    const isClientOrWorker = useCurrentUserRole(['client', 'worker'])

    const columnsCount = columns.length

    return (
        <Collapsible
            id={'tr-' + row.original?.id}
            open={open}
            onOpenChange={setOpen}
            asChild
        >
            <>
                <TableRow
                    id={'tr-header-' + row.original?.id}
                    className={cn('sticky border-t border-t-black even:bg-secondary/60')}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                    {row.getVisibleCells().map((cell, i) =>
                        shouldRenderCell(
                            cell.column.id,
                            category!,
                            isClientOrWorker,
                            i
                        ) ? (
                            <TableCell
                                style={{
                                    minWidth: cell.column.columnDef.size,
                                    maxWidth: cell.column.columnDef.size
                                }}
                                className={cn(
                                    'first:p-0',
                                    open
                                        ? 'border-t border-t-black first:border-l first:border-l-black last:border-r last:border-r-black'
                                        : '',
                                    !open
                                        ? cell.column.id === 'select' ||
                                          cell.column.id === 'arrow'
                                            ? getCommonPinningStyles(cell.column)
                                            : ''
                                        : '',
                                    !open
                                        ? cell.column.id === 'arrow'
                                            ? 'left-10'
                                            : ''
                                        : ''
                                )}
                                key={cell.id}
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        ) : null
                    )}
                </TableRow>

                <CollapsibleContent asChild>
                    <tr
                        className={cn(isTablet ? '' : 'sticky top-10 z-50')}
                        id={'tr-' + row.original?.id}
                    >
                        <td
                            className='max-w-[100vw] overflow-y-auto rounded-b-sm border-x border-b border-black p-0'
                            colSpan={columnsCount + 1}
                        >
                            <SubTable data={originItems} />
                        </td>
                    </tr>
                </CollapsibleContent>
            </>
        </Collapsible>
    )
}
