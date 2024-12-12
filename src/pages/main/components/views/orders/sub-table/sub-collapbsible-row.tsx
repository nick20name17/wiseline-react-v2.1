import { type Row, flexRender } from '@tanstack/react-table'
import { motion } from 'motion/react'
import { StringParam, useQueryParam } from 'use-query-params'

import { SubSubTable } from './sub-sub-table/sub-sub-table'
import type { EBMSItemsData } from '@/api/ebms/ebms.types'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { TableCell, TableRow } from '@/components/ui/table'
import { trimOnlyColumns } from '@/config/table'
import { cn } from '@/lib/utils'

interface CollapsibleRowProps {
    row: Row<EBMSItemsData>
}

export const SubCollapsibleRow: React.FC<CollapsibleRowProps> = ({ row }) => {
    const [category] = useQueryParam('category', StringParam)

    const MotionTableRow = motion(TableRow, {
        forwardMotionProps: true
    })

    const MotionTableCell = motion(TableCell, {
        forwardMotionProps: true
    })

    return (
        <Collapsible asChild>
            <>
                <MotionTableRow
                    layout
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                    {row.getVisibleCells().map((cell) =>
                        trimOnlyColumns.includes(cell.column.id) &&
                        category !== 'Trim' ? null : (
                            <MotionTableCell
                                layout
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
                        )
                    )}
                </MotionTableRow>
                <CollapsibleContent asChild>
                    <motion.tr layout>
                        <td
                            className='max-w-[100vw] bg-background py-2 pl-2 pr-3'
                            colSpan={row.getVisibleCells().length}
                        >
                            <SubSubTable data={row.original.cutting_items} />
                        </td>
                    </motion.tr>
                </CollapsibleContent>
            </>
        </Collapsible>
    )
}
