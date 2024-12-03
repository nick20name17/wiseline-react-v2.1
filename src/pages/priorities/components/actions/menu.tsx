import { MoreHorizontal } from 'lucide-react'

import { EditPriority } from './edit'
import { RemovePriority } from './remove'
import type { PrioritiesData } from '@/api/priorities/priorities.types'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface PriorityMenuProps {
    priority: PrioritiesData
}

export const PriorityMenu = ({ priority }: PriorityMenuProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'
                >
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
