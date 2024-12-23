import { MoreHorizontal } from 'lucide-react'

import { EditFlow } from './edit'
import { RemoveFlow } from './remove'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface FlowMenuProps {
    id: number
    name: string
}

export const FlowMenu = ({ id, name }: FlowMenuProps) => {
    return (
        <Popover>
            <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                <Button
                    className='-mt-1.5'
                    variant='ghost'
                    size='icon'
                >
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='flex w-fit flex-col p-2'>
                <EditFlow
                    id={id}
                    name={name}
                />
                <RemoveFlow
                    id={id}
                    name={name}
                />
            </PopoverContent>
        </Popover>
    )
}
