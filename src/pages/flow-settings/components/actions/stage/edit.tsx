import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2Icon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

import { usePatchStageMutation } from '@/api/stages/stages'
import type { StagePatchPayload } from '@/api/stages/stages.types'
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

interface EditStatusProps {
    id: number
    name: string
    description: string
    color: string
}

const stageSchema = z.object({
    name: z.string().min(1, 'Stage name is required'),
    description: z.string().optional()
})

type EditStatusFormData = zodInfer<typeof stageSchema>

export const EditStatus = ({ id, name, description, color }: EditStatusProps) => {
    const form = useForm({
        defaultValues: { name, description: description || '' },
        resolver: zodResolver(stageSchema)
    })

    const [open, setOpen] = useState(false)

    const [colorValue, setColorValue] = useState(color)

    const [editStage, { isLoading }] = usePatchStageMutation()

    const reset = () => {
        form.reset()
        setOpen(false)
    }

    const handleEditStage = async (data: StagePatchPayload) => {
        try {
            await editStage(data).unwrap()
            reset()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            toast.error(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onSubmit: SubmitHandler<EditStatusFormData> = (formData) => {
        handleEditStage({
            id,
            data: {
                ...formData,
                color: colorValue
            }
        })
    }

    const onValueChange = (value: string) => setColorValue(value)

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
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Edit status</DialogTitle>
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
                            defaultValue={color}
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
                            {isLoading ? <Loader2 className='animate-spin' /> : 'Edit'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
