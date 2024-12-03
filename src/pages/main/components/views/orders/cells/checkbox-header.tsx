import type { Table } from '@tanstack/react-table'

import type { OrdersData } from '@/api/ebms/ebms.types'
import { Checkbox } from '@/components/ui/checkbox'

interface CheckboxHeaderProps {
    table: Table<OrdersData>
}

export const CheckboxHeader = ({ table }: CheckboxHeaderProps) => {
    return (
        <div className='flex items-center justify-center'>
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        </div>
    )
}
