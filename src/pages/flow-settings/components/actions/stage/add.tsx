import { Loader2, PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

import { useAddStageMutation } from '@/api/stages/stages'
import type { StageAddData } from '@/api/stages/stages.types'
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
import { Textarea } from '@/components/ui/textarea'
import { stagesColorPresets } from '@/config/stages'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

interface AddStatusProps {
    flowId: number
}
const stageSchema = z.object({
    name: z.string().min(1, 'Stage name is required'),
    description: z.string().optional()
})

type AddStatusFormData = zodInfer<typeof stageSchema>

export const AddStatus = ({ flowId }: AddStatusProps) => {
    const form = useForm({
        defaultValues: {
            name: '',
            description: ''
        }
    })

    const [open, setOpen] = useState(false)

    const [addStage, { isLoading }] = useAddStageMutation()

    const defaultColor = stagesColorPresets[0]
    const [color, setColor] = useState(defaultColor)

    const reset = () => {
        form.reset()
        setOpen(false)
    }

    const handleAddStage = async (data: StageAddData) => {
        try {
            await addStage(data).unwrap()
            reset()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onValueChange = (value: string) => setColor(value)

    const onSubmit: SubmitHandler<AddStatusFormData> = (formData) =>
        handleAddStage({
            ...formData,
            color,
            flow: flowId
        })

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    onClick={(e) => e.stopPropagation()}
                    className='mt-1 flex w-full items-center'
                    variant='outline'
                    size='lg'
                >
                    <PlusCircleIcon />
                    Add Status
                </Button>
            </DialogTrigger>
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Add status</DialogTitle>
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
                                    <FormLabel>Stage name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='done'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stage description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className='resize-none'
                                            placeholder='Enter status description'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Tabs
                            onValueChange={onValueChange}
                            defaultValue={defaultColor}
                        >
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
                            type='submit'
                        >
                            {isLoading ? <Loader2 className='animate-spin' /> : 'Add'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
