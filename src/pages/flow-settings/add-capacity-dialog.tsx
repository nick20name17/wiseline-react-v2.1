import { Edit2Icon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import type { infer as zodInfer } from 'zod'

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
import { capacitySchema } from '@/config/validation-schemas'
import { useCustomForm } from '@/hooks'
import {
    useAddCapacityMutation,
    usePatchCapacityMutation
} from '@/store/api/capacities/capacities'
import type {
    CapacitiesAddData,
    CapacitiesPatchData
} from '@/store/api/capacities/capacities.types'
import { isErrorWithMessage } from '@/utils'

interface AddCapacityDialogProps {
    categoryId: string
    capacityId: number | null
    capacity: number
}

type FormData = zodInfer<typeof capacitySchema>

export const AddCapacityDialog: React.FC<AddCapacityDialogProps> = ({
    categoryId,
    capacity,
    capacityId
}) => {
    const form = useCustomForm(capacitySchema, { per_day: String(capacity ?? '') })

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

    const handlePatchCapacity = async (data: CapacitiesPatchData) => {
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
                    className='h-5 w-5'
                    size='icon'
                    variant='ghost'>
                    <Edit2Icon className='h-3 w-3' />
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
                        className='mx-auto w-full space-y-5'
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
                                <Loader2 className='size-4 animate-spin' />
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
