import { Loader2, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type infer as zodInfer } from 'zod'

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

import { useAddUserMutation } from '@/api/users/users'
import type { Roles } from '@/api/users/users.types'
import { emailShape, passwordShape } from '@/config/validation-schemas'
import { isErrorWithMessage } from '@/utils/is-error-with-message'

const editUserSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: emailShape,
    password: passwordShape,
    role: z.custom<Roles>()
})

type AddUserFormData = zodInfer<typeof editUserSchema>

export const AddUser = () => {
    const [open, setOpen] = useState(false)
    const [addUser, { isLoading }] = useAddUserMutation()

    const form = useForm<AddUserFormData>({
        defaultValues: {
            email: '',
            first_name: '',
            last_name: '',
            role: 'client',
            password: ''
        }
    })

    const currentUserName = `${form.watch('first_name')} ${form.watch('last_name')}`

    const successToast = () =>
        toast.success(`User ${currentUserName}`, {
            description: 'Added successfully'
        })

    const errorToast = (message: string) =>
        toast.error(`User ${currentUserName}`, {
            description: message
        })

    const reset = () => {
        form.reset()
        setOpen(false)
    }

    const handleAddUser = async (data: AddUserFormData) => {
        reset()

        try {
            await addUser({
                ...data,
                role: data.role as Roles
            })
                .unwrap()
                .then(successToast)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onSubmit: SubmitHandler<AddUserFormData> = (formData) => handleAddUser(formData)

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={(e) => e.stopPropagation()}
                    variant='ghost'>
                    <PlusCircle />
                    Add new user
                </Button>
            </DialogTrigger>
            <DialogContent className='mx-2 rounded-md'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Add new user</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
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
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='password123'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='role'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        <SelectTrigger className='w-full min-w-[160px] text-left'>
                                            <SelectValue placeholder='Select role' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='admin'>Admin</SelectItem>
                                            <SelectItem value='worker'>Worker</SelectItem>
                                            <SelectItem value='manager'>
                                                Manager
                                            </SelectItem>
                                            <SelectItem value='client'>
                                                View only
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={isLoading}
                            className='w-full'
                            type='submit'>
                            {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Add new user'
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
