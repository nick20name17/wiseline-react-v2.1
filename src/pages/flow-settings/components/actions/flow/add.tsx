import { Loader2, PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

import { useAddFlowMutation } from '@/api/flows/flows'
import type { FlowsAddData } from '@/api/flows/flows.types'
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
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFlowProps {
    categoryId: string
}
const flowSchema = z.object({
    name: z.string().min(1, 'Flow name is required')
})

type AddFlowFormData = zodInfer<typeof flowSchema>

export const AddFlow: React.FC<AddFlowProps> = ({ categoryId }) => {
    const form = useForm({
        defaultValues: {
            name: ''
        },
        resolver: zodResolver(flowSchema)
    })

    const [addFlow, { isLoading }] = useAddFlowMutation()

    const reset = () => {
        form.reset()
        setOpen(false)
    }

    const handleAddFlow = async (data: FlowsAddData) => {
        try {
            await addFlow(data).unwrap()
            reset()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onSubmit: SubmitHandler<AddFlowFormData> = (formData) =>
        handleAddFlow({
            ...formData,
            category: categoryId
        })

    const [open, setOpen] = useState(false)

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={(e) => e.stopPropagation()}
                    className='flex w-full items-center '
                    size='lg'>
                    <PlusCircleIcon  />
                    Add Flow
                </Button>
            </DialogTrigger>
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Add flow</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        method='POST'
                        className='mx-auto w-full space-y-4'
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
                                'Add'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
