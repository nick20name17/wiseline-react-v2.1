import type { Row } from '@tanstack/react-table'

import type { EBMSItemsData } from '@/api/ebms/ebms.types'
import { Checkbox } from '@/components/ui/checkbox'

interface CheckboxCellProps {
    row: Row<EBMSItemsData>
}

export const CheckboxCell = ({ row }: CheckboxCellProps) => {
    return (
        <div className='flex items-center justify-center'>
            <Checkbox
                className='border border-muted-foreground data-[state=checked]:bg-muted-foreground'
                checked={row.getIsSelected()}
                value={row.original.id}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value)
                }}
                aria-label='Select row'
            />
        </div>
    )
}
