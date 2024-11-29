import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2Icon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

import { usePatchPriorityMutation } from '@/api/priorities/priorities'
import type {
    PrioritiesData,
    PrioritiesPatchPayload
} from '@/api/priorities/priorities.types'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { stagesColorPresets } from '@/config/stages'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

const prioritySchema = z.object({
    name: z.string().min(1, 'Priority name is required'),
    position: z.string().min(1, 'Priority number is required')
})

type EditPriorityFormData = zodInfer<typeof prioritySchema>

interface EditPriorityProps {
    priority: PrioritiesData
}

export const EditPriority: React.FC<EditPriorityProps> = ({ priority }) => {
    const [color, setColor] = useState(priority?.color)
    const [open, setOpen] = useState(false)

    const form = useForm<EditPriorityFormData>({
        resolver: zodResolver(prioritySchema),
        defaultValues: {
            name: priority.name,
            position: priority.position.toString()
        }
    })

    const [patchPriority, { isLoading }] = usePatchPriorityMutation()

    const handleAddStage = async (data: PrioritiesPatchPayload) => {
        form.reset()
        setOpen(false)
        try {
            await patchPriority(data).unwrap()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }


    const onSubmit: SubmitHandler<EditPriorityFormData> = (formData) =>
        handleAddStage({
            id: priority.id,
            data: {
                name: formData.name,
                position: +formData.position,
                color
            }
        })

    const onValueChange = (value: string) => setColor(value)

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
                    <Edit2Icon />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Edit Priority</DialogTitle>
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
                                    <FormLabel>Priority name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='low'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='position'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority number</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='10'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Tabs
                            onValueChange={onValueChange}
                            defaultValue={priority?.color}>
                            <TabsList className='gap-x-2 bg-transparent p-0'>
                                {stagesColorPresets.map((color) => (
                                    <TabsTrigger
                                        key={color}
                                        value={color}
                                        className='h-6 w-6 rounded-sm data-[state=active]:outline data-[state=active]:outline-offset-2'
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </TabsList>
                        </Tabs>

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
