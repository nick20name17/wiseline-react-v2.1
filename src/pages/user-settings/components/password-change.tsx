import { useChangePasswordMutation } from '@/api/passwords/passwords'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { passwordShape } from '@/config/validation-schemas'

import { useAppSelector } from '@/store/hooks/hooks'
import { selectUser } from '@/store/slices/auth'
import { isErrorWithMessage } from '@/utils/is-error-with-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

 const changePasswordSchema = z.object({
    old_password: passwordShape,
    new_password1: passwordShape,
    new_password2: z.string().min(1, 'New password confirmation is required')
}).refine((data) => data.new_password1 === data.new_password2, {
    message: "Passwords don't match",
    path: ['new_password2']
})

type PasswordChangeFormData = zodInfer<typeof changePasswordSchema>

export const PasswordChange = () => {
    const [changePassword, { isLoading }] = useChangePasswordMutation()

    const form =useForm({
        defaultValues: {
            old_password: '',
            new_password1: '',
            new_password2: ''
        },
        resolver: zodResolver(changePasswordSchema)
    })
    const userId = useAppSelector(selectUser)?.id

    const successToast = () =>
        toast.success(`Change Password`, {
            description: 'Password changed successfully'
        })

    const errorToast = (description: string) =>
        toast.error('Change Password', { description })

    const handleChangePassword = async (data: PasswordChangeFormData) => {
        try {
            await changePassword({ id: userId!, data })
                .unwrap()
                .then(() => successToast())
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
        form.reset()
    }

    const onSubmit: SubmitHandler<PasswordChangeFormData> = (formData) => handleChangePassword(formData)

    return (
        <Card className='min-w-80 flex-1'>
            <CardHeader>
                <CardTitle> Change password</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        method='POST'
                        className='mx-auto mt-4 w-full space-y-5'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='old_password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Old password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Old password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='new_password1'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='New password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='new_password2'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Confirm password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={isLoading}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            className='w-full'
                            type='submit'>
                            {isLoading ? (
                                <Loader2 className='size-4 animate-spin' />
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
