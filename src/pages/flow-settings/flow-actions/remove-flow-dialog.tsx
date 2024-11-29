import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { useRemoveFlowMutation } from '@/store/api/flows/flows'
import { isErrorWithMessage } from '@/utils'

interface RemoveFlowDialogProps {
    id: number
    name: string
}

export const RemoveFlowDialog: React.FC<RemoveFlowDialogProps> = ({ id, name }) => {
    const [removeFlow, { isLoading }] = useRemoveFlowMutation()

    const [open, setOpen] = useState(false)

    const handleRemoveFlow = async (id: number) => {
        try {
            await removeFlow(id).unwrap()
            setOpen(false)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={(e) => e.stopPropagation()}
                    className='justify-start'
                    variant='ghost'
                    size='sm'>
                    <X className='mr-2 h-3.5 w-3.5' />
                    Remove
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[470px]'>
                <DialogHeader className='text-left'>
                    <DialogTitle>
                        Do you want to remove{' '}
                        <span className='text-destructive'>{name}</span> flow?
                    </DialogTitle>
                </DialogHeader>
                <Button
                    disabled={isLoading}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFlow(id)
                    }}
                    variant='destructive'
                    className='flex w-24 items-center gap-x-1.5'>
                    {isLoading ? (
                        <Loader2 className='mr-2 size-4 animate-spin' />
                    ) : (
                        'Remove'
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
