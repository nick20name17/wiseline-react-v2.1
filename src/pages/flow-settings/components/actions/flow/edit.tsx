import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2Icon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

import { usePatchFlowMutation } from '@/api/flows/flows'
import type { FlowsPatchPayload } from '@/api/flows/flows.types'
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
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface EditFlowProps {
    id: number
    name: string
}

const flowSchema = z.object({
    name: z.string().min(1, 'Flow name is required')
})

type EditFlowFormData = zodInfer<typeof flowSchema>

export const EditFlow = ({ id, name }: EditFlowProps) => {
    const form = useForm({
        defaultValues: {
            name
        },
        resolver: zodResolver(flowSchema)
    })

    const [patch, { isLoading }] = usePatchFlowMutation()

    const reset = () => {
        form.reset()
        setOpen(false)
    }

    const handlePatch = async (data: FlowsPatchPayload) => {
        try {
            await patch(data).unwrap()
            reset()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onSubmit: SubmitHandler<EditFlowFormData> = (formData) =>
        handlePatch({ id, data: formData })

    const [open, setOpen] = useState(false)

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
                    <Edit2Icon />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent
                onClick={(e) => e.stopPropagation()}
                className='mx-2 rounded-md'
            >
                <DialogHeader className='text-left'>
                    <DialogTitle>Edit flow</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        method='POST'
                        className='mx-auto w-full space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
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
                            type='submit'
                        >
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
