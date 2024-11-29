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
import { flowSchema } from '@/config/validation-schemas'
import { useCustomForm } from '@/hooks'
import { usePatchFlowMutation } from '@/store/api/flows/flows'
import type { FlowsPatchData } from '@/store/api/flows/flows.types'
import { isErrorWithMessage } from '@/utils'

interface EditFlowDialogProps {
    id: number
    name: string
}

type FormData = zodInfer<typeof flowSchema>

export const EditFlowDialog: React.FC<EditFlowDialogProps> = ({ id, name }) => {
    const form = useCustomForm(flowSchema, { name })

    const [patch, { isLoading }] = usePatchFlowMutation()

    const reset = () => {
        form.reset()
        setOpen(false)
    }

    const handlePatch = async (data: FlowsPatchData) => {
        try {
            await patch(data).unwrap()
            reset()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onSubmit: SubmitHandler<FormData> = (formData) =>
        handlePatch({ id, data: formData })

    const [open, setOpen] = useState(false)

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
                    <Edit2Icon className='mr-2 h-3.5 w-3.5' />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent
                onClick={(e) => e.stopPropagation()}
                className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Edit flow</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        method='POST'
                        className='mx-auto w-full space-y-5'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Flow name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='flow'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={isLoading}
                            onClick={(e) => e.stopPropagation()}
                            className='w-full'
                            type='submit'>
                            {isLoading ? (
                                <Loader2 className='size-4 animate-spin' />
                            ) : (
                                'Edit'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
