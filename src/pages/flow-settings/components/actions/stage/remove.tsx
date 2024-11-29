import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useRemoveStageMutation } from '@/api/stages/stages'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { isErrorWithMessage } from '@/utils/is-error-with-message'


interface RemoveStatusProps {
    id: number
    name: string
}

export const RemoveStatus: React.FC<RemoveStatusProps> = ({ id, name }) => {
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
                    <X />
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
                    className='flex w-24 items-center '>
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
