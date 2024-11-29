import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EditFlow } from './edit'
import { RemoveFlow } from './remove'

interface FlowMenuProps {
    id: number
    name: string
}

export const FlowMenu: React.FC<FlowMenuProps> = ({ id, name }) => {
    return (
        <Popover>
            <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                <Button
                    className='-mt-1.5'
                    variant='ghost'
                    size='icon'>
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
