import { MoreHorizontal } from 'lucide-react'

import { EditFlowDialog } from './edit-flow-dialog'
import { RemoveFlowDialog } from './remove-flow-dialog'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface FlowActionsProps {
    id: number
    name: string
}

export const FlowActions: React.FC<FlowActionsProps> = ({ id, name }) => {
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
                <EditFlowDialog
                    id={id}
                    name={name}
                />
                <RemoveFlowDialog
                    id={id}
                    name={name}
                />
            </PopoverContent>
        </Popover>
    )
}
