import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useRemovePriorityMutation } from '@/api/priorities/priorities'
import type { PrioritiesData } from '@/api/priorities/priorities.types'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface RemovePriorityProps {
    priority: PrioritiesData
}

export const RemovePriority = ({ priority }: RemovePriorityProps) => {
    const [removePriority, { isLoading }] = useRemovePriorityMutation()

    const [open, setOpen] = useState(false)

    const handleRemoveStage = async (id: number) => {
        try {
            await removePriority(id).unwrap()
            setOpen(false)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        handleRemoveStage(priority.id)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    onClick={(e) => e.stopPropagation()}
                    variant='ghost'
                    size='sm'
                >
                    <X />
                    Remove
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[470px]'>
                <DialogHeader className='text-left'>
                    <DialogTitle>
                        Do you want to remove{' '}
                        <span className='text-destructive'>{priority.name}</span>{' '}
                        priority?
                    </DialogTitle>
                </DialogHeader>
                <Button
                    disabled={isLoading}
                    onClick={onRemove}
                    variant='destructive'
                    className='flex w-24 items-center'
                >
                    {isLoading ? <Loader2 className='animate-spin' /> : 'Remove'}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
