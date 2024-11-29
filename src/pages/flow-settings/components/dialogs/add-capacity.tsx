import { Edit2Icon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'


import {
    useAddCapacityMutation,
    usePatchCapacityMutation
} from '@/api/capacities/capacities'
import type {
    CapacitiesAddData,
    CapacitiesPatchPayload
} from '@/api/capacities/capacities.types'
import { isErrorWithMessage } from '@/utils/is-error-with-message'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddCapacityDialogProps {
    categoryId: string
    capacityId: number | null
    capacity: number
}

const capacitySchema = z.object({
        per_day: z.string().min(1, 'Per day is required')
    })

type FormData = zodInfer<typeof capacitySchema>

export const AddCapacityDialog: React.FC<AddCapacityDialogProps> = ({
    categoryId,
    capacity,
    capacityId
}) => {
    const form = useForm({
        defaultValues: { per_day: String(capacity ?? '') },
        resolver: zodResolver(capacitySchema)
    })

    const [addCapacity, { isLoading }] = useAddCapacityMutation()
    const [patchCapacity, { isLoading: isPatching }] = usePatchCapacityMutation()

    const reset = () => {
        form.reset()
        setOpen(false)
    }

    const handleAddCapacity = async (data: CapacitiesAddData) => {
        try {
            await addCapacity(data).unwrap()
            reset()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const handlePatchCapacity = async (data: CapacitiesPatchPayload) => {
        try {
            await patchCapacity(data).unwrap()
            reset()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onSubmit: SubmitHandler<FormData> = (formData) => {
        if (capacityId) {
            handlePatchCapacity({ id: capacityId, data: { per_day: +formData.per_day } })
        } else {
            handleAddCapacity({
                per_day: +formData.per_day,
                category: categoryId
            })
        }
    }

    const [open, setOpen] = useState(false)

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={(e) => e.stopPropagation()}
                    className='size-5'
                    size='icon'
                    variant='ghost'>
                    <Edit2Icon className='!size-3' />
                </Button>
            </DialogTrigger>
            <DialogContent
                onClick={(e) => e.stopPropagation()}
                className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Сapacity</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        method='POST'
                        className='mx-auto w-full space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='per_day'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Per day</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='500'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={isLoading || isPatching}
                            className='w-full'
                            type='submit'>
                            {isLoading || isPatching ? (
                                <Loader2 className='animate-spin' />
                            ) : capacityId ? (
                                'Save'
                            ) : (
                                'Add'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
