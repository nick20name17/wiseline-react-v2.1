import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EditStatus } from './edit'
import { RemoveStatus } from './remove'

interface StatusMenuProps {
    id: number
    name: string
    description: string
    color: string
}

export const StatusMenu: React.FC<StatusMenuProps> = ({
    id,
    name,
    color,
    description
}) => {
    return (
        <Popover>
            <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                <Button
                    variant='ghost'
                    size='icon'>
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
