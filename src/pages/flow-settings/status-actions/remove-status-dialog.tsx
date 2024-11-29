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
import { useRemoveStageMutation } from '@/store/api/stages/stages'
import { isErrorWithMessage } from '@/utils'

interface RemoveStatusDialogProps {
    id: number
    name: string
}

export const RemoveStatusDialog: React.FC<RemoveStatusDialogProps> = ({ id, name }) => {
    const [removeStage, { isLoading }] = useRemoveStageMutation()

    const [open, setOpen] = useState(false)

    const handleRemoveStage = async (id: number) => {
        try {
            await removeStage(id).unwrap()
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
                        <span className='text-destructive'>{name}</span> status?
                    </DialogTitle>
                </DialogHeader>
                <Button
                    disabled={isLoading}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveStage(id)
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
