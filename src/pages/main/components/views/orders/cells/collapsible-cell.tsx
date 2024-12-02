import { ChevronDown } from 'lucide-react'

import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

interface CollapsibleCellProps {
    disabled?: boolean
}

export const CollapsibleCell: React.FC<CollapsibleCellProps> = ({ disabled = false }) => {
    return (
        <CollapsibleTrigger
            data-icon
            className='group flex !size-full items-center justify-center bg-transparent'
        >
            <ChevronDown
                className={cn(
                    'size-4 transition-transform group-data-[state=open]:-rotate-90',
                    disabled ? 'cursor-not-allowed opacity-50' : ''
                )}
            />
        </CollapsibleTrigger>
    )
}
