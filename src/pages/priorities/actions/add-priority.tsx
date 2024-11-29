import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { prioritySchema } from '@/config/validation-schemas'
import { useAddPriorityMutation } from '@/store/api/priorities/priorities'
import type { PrioritiesAddData } from '@/store/api/priorities/priorities.types'
import { isErrorWithMessage } from '@/utils'

type FormData = zodInfer<typeof prioritySchema>

export const AddPriority = () => {
    const form = useForm<FormData>({
        resolver: zodResolver(prioritySchema),
        mode: 'onSubmit',
        shouldFocusError: true,
        defaultValues: {
            name: '',
            position: ''
        }
    })

    const [addPriority, { isLoading }] = useAddPriorityMutation()

    const handleAddStage = async (data: PrioritiesAddData) => {
        form.reset()
        setOpen(false)
        try {
            await addPriority(data).unwrap()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const colorPresets = [
        '#0090FF',
        '#09D8B5',
        '#222222',
        '#FFCA14',
        '#EF5E01',
        '#3E9B4F',
        '#CA244C',
        '#8145B5',
        '#CE2C31'
    ]

    const defaultColor = colorPresets[0]

    const [color, setColor] = useState(defaultColor)
    const [open, setOpen] = useState(false)

    const onSubmit: SubmitHandler<FormData> = (formData) =>
        handleAddStage({
            name: formData.name,
            position: +formData.position,
            color
        })

    const onValueChange = (value: string) => setColor(value)

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={(e) => e.stopPropagation()}
                    className='mt-1 flex w-full items-center gap-x-1.5'
                    size='lg'>
                    <PlusCircleIcon width='16px' />
                    Add Priority
                </Button>
            </DialogTrigger>
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Add Priority</DialogTitle>
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
                            defaultValue={defaultColor}>
                            <TabsList className='gap-x-2 bg-transparent p-0'>
                                {colorPresets.map((color) => (
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
                                'Add'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
