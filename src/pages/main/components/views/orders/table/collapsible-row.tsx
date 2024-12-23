import { type Row, flexRender } from '@tanstack/react-table'
import { format } from 'date-fns'
import { motion } from 'motion/react'
import { Fragment, useState } from 'react'
import { StringParam, useQueryParam, withDefault } from 'use-query-params'

import { SubTable } from '../sub-table/sub-table'

import { columns } from './columns'
import type { OrdersData } from '@/api/ebms/ebms.types'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { TableCell, TableRow } from '@/components/ui/table'
import { shouldRenderCell } from '@/config/table'
import { useCurrentUserRole } from '@/hooks/use-current-user-role'
import { cn } from '@/lib/utils'

interface CollapsibleRowProps {
    row: Row<OrdersData>
    index: number
}
export const CollapsibleRow = ({ row, index }: CollapsibleRowProps) => {
    const [category] = useQueryParam('category', StringParam)
    const [open, setOpen] = useState(false)
    const isClientOrWorker = useCurrentUserRole(['client', 'worker'])

    const [animate] = useQueryParam('animate', withDefault(StringParam, null), {
        removeDefaultsFromUrl: true
    })

    const MotionTableRow = motion(TableRow, {
        forwardMotionProps: true
    })

    const MotionTableCell = motion(TableCell, {
        forwardMotionProps: true
    })

    console.log(animate !== null ? !!animate : false)

    return (
        <Collapsible
            id={'tr-' + row.original?.id}
            open={open}
            onOpenChange={setOpen}
            asChild
        >
            <>
                <MotionTableRow
                    layout={animate !== null ? !!animate : false}
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
                                layout={animate !== null ? !!animate : false}
                                className={cn(
                                    cell.column.getIsPinned()
                                        ? 'sticky left-0 top-7 z-30 border-r-0 bg-secondary shadow-[inset_-1px_0_0] shadow-border'
                                        : '',
                                    cell.column.id === 'arrow' ? 'left-10' : ''
                                )}
                                style={{
                                    maxWidth:
                                        cell.column.columnDef.size !== 0
                                            ? cell.column.columnDef.size
                                            : undefined,
                                    minWidth:
                                        cell.column.columnDef.size !== 0
                                            ? cell.column.columnDef.size
                                            : undefined,
                                    width:
                                        cell.column.columnDef.size !== 0
                                            ? cell.column.columnDef.size
                                            : undefined
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
                    <motion.tr
                        layout={animate !== null ? !!animate : false}
                        style={{ zIndex: 30 - index }}
                        className='sticky top-[18px] p-0'
                    >
                        <td className='sticky left-0 top-8 z-20 w-10 max-w-10 p-0'></td>
                        <td className='sticky left-10 top-8 z-20 w-12 max-w-12 p-0'></td>

                        <td
                            className='max-w-[calc(100vw-28.5rem)] p-0 py-3 pr-4'
                            colSpan={columns.length - 2}
                        >
                            <SubTable data={row.original.origin_items} />
                        </td>
                    </motion.tr>
                </CollapsibleContent>
            </>
        </Collapsible>
    )
}

interface GroupedRowsProps {
    groupByDate: [string, Row<OrdersData>[]][]
}

export const CollapsibleGroupedRows = ({ groupByDate }: GroupedRowsProps) => {
    const columnsCount = columns.length

    const [animate] = useQueryParam('animate', withDefault(StringParam, null), {
        removeDefaultsFromUrl: true
    })

    const MotionTableRow = motion(TableRow, {
        forwardMotionProps: true
    })

    const MotionTableCell = motion(TableCell, {
        forwardMotionProps: true
    })

    return groupByDate.map((group) =>
        group[1].map((row, index) => {
            const isIndeterminate =
                group[1].some((row) => row.getIsSelected()) &&
                !group[1].every((row) => row.getIsSelected())
                    ? 'indeterminate'
                    : group[1].every((row) => row.getIsSelected())

            return (
                <Fragment>
                    {index === 0 && (
                        <MotionTableRow
                            layout={animate !== null ? !!animate : false}
                            className='bg-secondary !p-0'
                        >
                            <MotionTableCell
                                layout={animate !== null ? !!animate : false}
                                colSpan={columnsCount}
                                className='!p-0'
                            >
                                <div className='!m-0 flex h-8 items-center !bg-gray-300 text-sm'>
                                    <div className='sticky left-0 flex h-full w-10 items-center justify-center !bg-gray-300 shadow-[inset_-1px_0_0] shadow-border'>
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
                            </MotionTableCell>
                        </MotionTableRow>
                    )}
                    <CollapsibleRow
                        row={group[1][0]}
                        index={index}
                    />
                </Fragment>
            )
        })
    )
}

interface CollapsibleRowProps {
    row: Row<OrdersData>
}

// export const CollapsibleRow = memo(({ row }: CollapsibleRowProps) => {
//     const [category] = useQueryParam('category', StringParam)
//     // const { isTablet } = useMatchMedia()

//     const isClientOrWorker = useCurrentUserRole(['client', 'worker'])

//     return (
//         <Collapsible
//             id={'tr-' + row.original?.id}
//             asChild
//         >
//             <>
//                 <TableRow
//                     id={'tr-header-' + row.original?.id}
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
//                                 className={cn(
//                                     cell.column.getIsPinned()
//                                         ? 'sticky left-0 top-7 z-30 border-r-0 bg-secondary shadow-[inset_-1px_0_0] shadow-border'
//                                         : '',
//                                     cell.column.id === 'arrow' ? 'left-10' : ''
//                                 )}
//                                 style={{
//                                     maxWidth: cell.column.columnDef.size,
//                                     minWidth: cell.column.columnDef.size
//                                 }}
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
//                         id={'tr-' + row.original?.id}
//                         className='sticky top-[22px] z-20'
//                     >
//                         {row
//                             .getVisibleCells()
//                             .slice(0, 2)
//                             .map((_, index) => (
//                                 <td
//                                     key={`empty-${index}`}
//                                     className='sticky left-10 top-8 z-20 bg-background p-0 first:left-0'
//                                 ></td>
//                             ))}

//                         <td
//                             className='max-w-[100vw] py-2 pl-0 pr-3'
//                             colSpan={row.getVisibleCells().length - 2}
//                         >
//                             <SubTable data={row.original.origin_items} />
//                         </td>
//                     </tr>
//                 </CollapsibleContent>
//             </>
//         </Collapsible>
//     )
// })
