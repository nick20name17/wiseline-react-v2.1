import { z } from "zod"

export const passwordShape =  z.string()
        .min(1, 'Password is required')
        .min(8, 'Password must contain at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one digit')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

export const emailShape = z.string()
    .min(1, 'Email is required')
    .email('Email is invalid')

// export const loginSchema = object({
//     email: string().min(1, 'Email is required').email(),
//     ...passwordSchema
// })

// export const commentSchema = object({
//     text: z.string()
// })

// export const stageSchema = object({
//     name: string().min(1, 'Stage name is required'),
//     description: string().optional()
// })

// export const flowSchema = object({
//     name: string().min(1, 'Flow name is required')
// })

// export const capacitySchema = object({
//     per_day: string().min(1, 'Per day is required')
// })




// export const passwordResetConfirmSchema = object({
//     ...newPasswordSchema.shape
// }).refine((data) => data.new_password1 === data.new_password2, {
//     message: "Passwords don't match",
//     path: ['new_password2']
// })




// export const addUserSchema = object({
//     ...userPatchSchema.shape,
//     password: passwordSchema.password,
//     role: string({
//         required_error: 'Please select an role'
//     }).min(1, 'Role is required')
// })

// export const editUserSchema = object({
//     ...userPatchSchema.shape,
//     password: passwordSchema.password,
//     role: string({
//         required_error: 'Please select an role'
//     }).min(1, 'Role is required')
// })

// export const prioritySchema = object({
//     name: string().min(1, 'Priority name is required'),
//     position: string().min(1, 'Priority number is required')
// })
