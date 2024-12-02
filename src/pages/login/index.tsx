import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z, type infer as zodInfer } from 'zod'

import { ForgetPassword } from './components/forget-password'
import { useLoginMutation } from '@/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { routes } from '@/config/routes'
import { emailShape, passwordShape } from '@/config/validation-schemas'
import { useAppSelector } from '@/store/hooks/hooks'
import { selectIsAuth } from '@/store/slices/auth'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

const loginSchema = z.object({
    email: emailShape,
    password: passwordShape
})

type LoginFormData = zodInfer<typeof loginSchema>

export const LoginPage = () => {
    const isAuth = useAppSelector(selectIsAuth)
    const [rememberMe, setRememberMe] = useState(true)

    const navigate = useNavigate()
    const [error, setError] = useState('')

    const form = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: zodResolver(loginSchema)
    })

    const [login, { isLoading }] = useLoginMutation()

    const handleLogin = async (data: LoginFormData) => {
        try {
            await login(data).unwrap()
            if (!rememberMe) {
                sessionStorage.setItem('rememberMe', JSON.stringify({ rememberMe }))
            }
            navigate(routes.main)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            setError(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onRememberMe = () => setRememberMe(!rememberMe)

    if (rememberMe) {
        localStorage.setItem('rememberMe', JSON.stringify({ rememberMe }))
    } else {
        localStorage.removeItem('rememberMe')
    }

    const onSubmit: SubmitHandler<LoginFormData> = (formData) => {
        handleLogin(formData)
    }

    useEffect(() => {
        if (isAuth) {
            navigate(routes.main)
        }
    }, [])

    return (
        <div className='flex h-screen items-center justify-center'>
            <div className='mx-auto w-[300px]'>
                <Form {...form}>
                    <form
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='nickname@gmail.com'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='.......'
                                            type='password'
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className='w-full'
                            disabled={isLoading}
                            type='submit'
                        >
                            {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Log In'
                            )}
                        </Button>
                    </form>
                </Form>
                {error ? (
                    <div className='mt-4 text-sm font-medium text-destructive'>
                        {error}
                    </div>
                ) : null}
                <div className='mt-4 flex items-center justify-between'>
                    {/* <ForgetPassword disabled={isLoading} /> */}
                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            checked={rememberMe}
                            disabled={isLoading}
                            id='terms'
                            aria-label='Remember me'
                            onClick={onRememberMe}
                        />
                        <label
                            htmlFor='terms'
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                            Remember me
                        </label>
                    </div>
                    <ForgetPassword />
                </div>
            </div>
        </div>
    )
}
