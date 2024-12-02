import type { Table } from '@tanstack/react-table'

import { MultipatchPopover } from '../controls/multipatch-popover'

import type { EBMSItemsData } from '@/api/ebms/ebms.types'
import { Checkbox } from '@/components/ui/checkbox'

interface CheckboxHeaderProps {
    table: Table<EBMSItemsData>
}

export const CheckboxHeader: React.FC<CheckboxHeaderProps> = ({ table }) => {
    return (
        <>
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
            <MultipatchPopover table={table} />
        </>
    )
}
