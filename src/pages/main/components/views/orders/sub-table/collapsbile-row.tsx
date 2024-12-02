import { type Row, flexRender } from '@tanstack/react-table'
import { useState } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { subColumns } from './sub-columns'
import { SubSubTable } from './sub-sub-table/sub-sub-table'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { TableCell, TableRow } from '@/components/ui/table'
import { trimOnlyColumns } from '@/config/table'
import { cn } from '@/lib/utils'
import type { EBMSItemsData } from '@/store/api/ebms/ebms.types'

interface CollapsibleRowProps {
    row: Row<EBMSItemsData>
}

export const CollapsibleRow: React.FC<CollapsibleRowProps> = ({ row }) => {
    const [open, setOpen] = useState(false)

    const cuttingItems = row.original.cutting_items

    const [category] = useQueryParam('category', StringParam)

    const colSpan = subColumns.length + 1

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            asChild
        >
            <>
                <TableRow
                    className={cn(
                        'even:bg-secondary/60',
                        open ? 'bg-black/10 hover:bg-black/5' : ''
                    )}
                    data-state={row.getIsSelected() && 'selected'}
                >
                    {row.getVisibleCells().map((cell) =>
                        trimOnlyColumns.includes(cell.column.id) &&
                        category !== 'Trim' ? null : (
                            <TableCell
                                style={{
                                    minWidth: cell.column.columnDef.size,
                                    maxWidth: cell.column.columnDef.size
                                }}
                                key={cell.id}
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        )
                    )}
                </TableRow>

                <CollapsibleContent asChild>
                    <tr>
                        <td
                            className='max-w-[100vw] p-0'
                            colSpan={colSpan}
                        >
                            <SubSubTable data={cuttingItems} />
                        </td>
                    </tr>
                </CollapsibleContent>
            </>
        </Collapsible>
    )
}
