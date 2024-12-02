import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useRemoveFlowMutation } from '@/api/flows/flows'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface RemoveFlowProps {
    id: number
    name: string
}

export const RemoveFlow: React.FC<RemoveFlowProps> = ({ id, name }) => {
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
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    onClick={(e) => e.stopPropagation()}
                    className='justify-start'
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
                    className='flex w-24 items-center'
                >
                    {isLoading ? <Loader2 className='animate-spin' /> : 'Remove'}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
