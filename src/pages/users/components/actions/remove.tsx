import { Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { useRemoveUserMutation } from '@/api/users/users'
import type { User } from '@/api/users/users.types'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface RemoveUserProps {
    user: User
}

export const RemoveUser: React.FC<RemoveUserProps> = ({ user }) => {
    const userName = `${user.first_name} ${user.last_name}`
    const userId = user.id

    const [removeUser, { isLoading }] = useRemoveUserMutation()

    const [open, setOpen] = useState(false)

    const successToast = () =>
        toast.success(`User ${userName}`, {
            description: 'Removed successfully'
        })

    const errorToast = (message: string) =>
        toast.error(`User ${userName}`, {
            description: message
        })

    const handleRemoveUser = async (id: number) => {
        setOpen(false)

        try {
            await removeUser(id).unwrap().then(successToast)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
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
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>
                        Do you want to remove{' '}
                        <span className='text-destructive'>{userName}</span> ?
                    </DialogTitle>
                </DialogHeader>
                <Button
                    disabled={isLoading}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveUser(userId)
                    }}
                    variant='destructive'
                    className='flex w-fit items-center'
                >
                    {isLoading ? (
                        <Loader2 className='animate-spin' />
                    ) : false ? (
                        "Can't remove admin"
                    ) : (
                        'Remove'
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
