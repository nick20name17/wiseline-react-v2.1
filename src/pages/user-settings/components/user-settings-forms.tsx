import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

import { usePatchUserMutation } from '@/api/users/users'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { emailShape } from '@/config/validation-schemas'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectUser } from '@/store/slices/auth'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

const userPatchSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: emailShape
})

type UserSettingsFormData = zodInfer<typeof userPatchSchema>

export const UserSettingsForms = () => {
    const [open, setOpen] = useState(false)

    const { id: userId, email, first_name, last_name } = useAppSelector(selectUser)!

    const [patchUser, { isLoading }] = usePatchUserMutation()

    const form = useForm({
        defaultValues: {
            email,
            first_name,
            last_name
        },
        resolver: zodResolver(userPatchSchema)
    })

    const successToast = () =>
        toast.success(`User Settings`, {
            description: 'Data changed successfully'
        })

    const errorToast = (description: string) =>
        toast.error('Something went wrong', { description })

    const handlePatchUser = async (data: UserSettingsFormData) => {
        try {
            await patchUser({ id: userId!, data }).unwrap().then(successToast)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onSubmit: SubmitHandler<UserSettingsFormData> = (formData) =>
        handlePatchUser(formData)

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className='min-w-80 flex-1'
        >
            <Card className='h-[430px]'>
                <CardHeader>
                    <CardTitle className='flex items-center justify-between gap-x-4'>
                        User info
                        <CollapsibleTrigger asChild>
                            <Button
                                size='icon'
                                variant='ghost'
                            >
                                <Edit />
                            </Button>
                        </CollapsibleTrigger>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            method='POST'
                            className='mx-auto mt-4 w-full space-y-4'
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                disabled={!open}
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                inputMode='email'
                                                placeholder='nickname@gmail.com'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={!open}
                                control={form.control}
                                name='first_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='John'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={!open}
                                control={form.control}
                                name='last_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Doe'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <CollapsibleContent>
                                <Button
                                    disabled={isLoading}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    className='w-full'
                                    type='submit'
                                >
                                    {isLoading ? (
                                        <Loader2 className='animate-spin' />
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                            </CollapsibleContent>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </Collapsible>
    )
}
