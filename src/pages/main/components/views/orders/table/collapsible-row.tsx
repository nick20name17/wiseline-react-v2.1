import { type Row, flexRender } from '@tanstack/react-table'
import { format } from 'date-fns'
// interface CollapsibleRowProps {
//     row: Row<OrdersData>
// }
// export const CollapsibleRow = ({ row }: CollapsibleRowProps) => {
//     const [category] = useQueryParam('category', StringParam)
//     const [open, setOpen] = useState(false)
//     const { isTablet } = useMatchMedia()
//     const originItems = row.original.origin_items
//     const isClientOrWorker = useCurrentUserRole(['client', 'worker'])
//     const columnsCount = columns.length
//     return (
//         <Collapsible
//             id={'tr-' + row.original?.id}
//             open={open}
//             onOpenChange={setOpen}
//             asChild
//         >
//             <>
//                 <TableRow
//                     id={'tr-header-' + row.original?.id}
//                     className={cn('sticky border-t border-t-black even:bg-secondary/60')}
//                     data-state={row.getIsSelected() ? 'selected' : undefined}
//                 >
//                     {row.getVisibleCells().map((cell, i) =>
//                         shouldRenderCell(
//                             cell.column.id,
//                             category!,
//                             isClientOrWorker,
//                             i
//                         ) ? (
//                             <TableCell
//                                 style={{
//                                     minWidth: cell.column.columnDef.size,
//                                     maxWidth: cell.column.columnDef.size
//                                 }}
//                                 className={cn(
//                                     'first:p-0',
//                                     open
//                                         ? 'border-t border-t-black first:border-l first:border-l-black last:border-r last:border-r-black'
//                                         : '',
//                                     !open
//                                         ? cell.column.id === 'select' ||
//                                           cell.column.id === 'arrow'
//                                             ? ''
//                                             : ''
//                                         : '',
//                                     !open
//                                         ? cell.column.id === 'arrow'
//                                             ? 'left-10'
//                                             : ''
//                                         : ''
//                                 )}
//                                 key={cell.id}
//                             >
//                                 {flexRender(
//                                     cell.column.columnDef.cell,
//                                     cell.getContext()
//                                 )}
//                             </TableCell>
//                         ) : null
//                     )}
//                 </TableRow>
//                 <CollapsibleContent asChild>
//                     <tr
//                         className={cn(isTablet ? '' : 'sticky top-10 z-50')}
//                         id={'tr-' + row.original?.id}
//                     >
//                         <td
//                             className='max-w-[100vw] overflow-y-auto rounded-b-sm border-x border-b border-black p-0'
//                             colSpan={columnsCount + 1}
//                         >
//                             <SubTable data={originItems} />
//                         </td>
//                     </tr>
//                 </CollapsibleContent>
//             </>
//         </Collapsible>
//     )
// }
import { Fragment, memo } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { SubTable } from '../sub-table/sub-table'

import { columns } from './columns'
import type { OrdersData } from '@/api/ebms/ebms.types'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { TableCell, TableRow } from '@/components/ui/table'
import { shouldRenderCell } from '@/config/table'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'
import { cn } from '@/lib/utils'

interface GroupedRowsProps {
    originRow: Row<OrdersData>
    groupByDate: [string, Row<OrdersData>[]][]
}

export const CollapsibleGroupedRows = ({ groupByDate }: GroupedRowsProps) => {
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

export const CollapsibleRow = memo(({ row }: CollapsibleRowProps) => {
    const MotionTableRow = TableRow

    const MotionTableCell = TableCell

    const [category] = useQueryParam('category', StringParam)
    // const { isTablet } = useMatchMedia()

    const isClientOrWorker = useCurrentUserRole(['client', 'worker'])

    return (
        <Collapsible asChild>
            <>
                <MotionTableRow
                    id={'tr-header-' + row.original.id}
                    // initial={false}
                    // layout
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                    {row.getVisibleCells().map((cell, i) =>
                        shouldRenderCell(
                            cell.column.id,
                            category!,
                            isClientOrWorker,
                            i
                        ) ? (
                            <MotionTableCell
                                // initial={false}
                                // layout
                                className={cn(
                                    cell.column.getIsPinned()
                                        ? 'sticky left-0 top-7 z-30 border-r-0 bg-secondary shadow-[inset_-1px_0_0] shadow-border'
                                        : '',
                                    cell.column.id === 'arrow' ? 'left-10' : ''
                                )}
                                style={{
                                    maxWidth: cell.column.columnDef.size,
                                    minWidth: cell.column.columnDef.size
                                }}
                                key={cell.id}
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </MotionTableCell>
                        ) : null
                    )}
                </MotionTableRow>
                <CollapsibleContent asChild>
                    <tr
                        id={'tr-' + row.original.id}
                        // initial={false}
                        // layout
                        className='sticky top-[22px] z-20'
                    >
                        {row
                            .getVisibleCells()
                            .slice(0, 2)
                            .map((_, index) => (
                                <td
                                    key={`empty-${index}`}
                                    className='sticky left-10 top-8 z-20 bg-background p-0 first:left-0'
                                ></td>
                            ))}

                        <td
                            className='max-w-[100vw] py-2 pl-0 pr-3'
                            colSpan={row.getVisibleCells().length - 2}
                        >
                            <SubTable data={row.original.origin_items} />
                        </td>
                    </tr>
                </CollapsibleContent>
            </>
        </Collapsible>
    )
})
