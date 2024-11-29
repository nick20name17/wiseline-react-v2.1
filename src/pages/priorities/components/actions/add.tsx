import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

import { useAddPriorityMutation } from '@/api/priorities/priorities'
import type { PrioritiesAddData } from '@/api/priorities/priorities.types'
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

type AddPriorityFormData = zodInfer<typeof prioritySchema>

export const AddPriority = () => {
    const form = useForm<AddPriorityFormData>({
        resolver: zodResolver(prioritySchema),

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



    const defaultColor = stagesColorPresets[0]

    const [color, setColor] = useState(defaultColor)
    const [open, setOpen] = useState(false)

    const onSubmit: SubmitHandler<AddPriorityFormData> = (formData) =>
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
                    className='flex w-full items-center'
                    size='lg'>
                    <PlusCircleIcon />
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
                                <Loader2 className='animate-spin' />
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
