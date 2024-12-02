import { z } from 'zod'

export const passwordShape = z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must contain at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

export const emailShape = z.string().min(1, 'Email is required').email('Email is invalid')

// export const loginSchema = object({
//     email: string().min(1, 'Email is required').email(),
//     ...passwordSchema
// })

// export const commentSchema = object({
//     text: z.string()
// })
