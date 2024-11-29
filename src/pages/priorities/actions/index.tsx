import { MoreHorizontal } from 'lucide-react'

import { EditPriority } from './edit-priority'
import { RemovePriority } from './remove-priority'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { PrioritiesData } from '@/store/api/priorities/priorities.types'

interface PriorityActionsProps {
    priority: PrioritiesData
}

export const PriorityActions: React.FC<PriorityActionsProps> = ({ priority }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'>
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='flex w-fit flex-col p-2'>
                <EditPriority priority={priority} />
                <RemovePriority priority={priority} />
            </PopoverContent>
        </Popover>
    )
}
