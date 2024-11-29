import { MoreHorizontal } from 'lucide-react'

import { EditStatusDialog } from './edit-status-dialog'
import { RemoveStatusDialog } from './remove-status-dialog'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface StatusActionsProps {
    id: number
    name: string
    description: string
    color: string
}

export const StatusActions: React.FC<StatusActionsProps> = ({
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
                <EditStatusDialog
                    id={id}
                    name={name}
                    color={color}
                    description={description}
                />
                <RemoveStatusDialog
                    id={id}
                    name={name}
                />
            </PopoverContent>
        </Popover>
    )
}
