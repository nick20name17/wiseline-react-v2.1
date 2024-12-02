import type { Table } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import type { OrdersData } from '@/store/api/ebms/ebms.types'

interface CheckboxHeaderProps {
    table: Table<OrdersData>
}

export const CheckboxHeader: React.FC<CheckboxHeaderProps> = ({ table }) => {
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
