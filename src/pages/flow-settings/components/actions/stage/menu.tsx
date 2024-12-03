import { MoreHorizontal } from 'lucide-react'

import { EditStatus } from './edit'
import { RemoveStatus } from './remove'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface StatusMenuProps {
    id: number
    name: string
    description: string
    color: string
}

export const StatusMenu = ({ id, name, color, description }: StatusMenuProps) => {
    return (
        <Popover>
            <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                <Button
                    variant='ghost'
                    size='icon'
                >
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='flex w-fit flex-col p-2'>
                <EditStatus
                    id={id}
                    name={name}
                    color={color}
                    description={description}
                />
                <RemoveStatus
                    id={id}
                    name={name}
                />
            </PopoverContent>
        </Popover>
    )
}
