import type { CategoryData } from '../ebms/categories/categories.types'
import type { UsersProfileData } from '../profiles/profiles.types'

import type { PatchPayload, Response } from '@/api/types/query'

export type Roles = 'admin' | 'worker' | 'manager' | 'client'

export interface User {
    id: number
    email: string
    is_active?: boolean
    is_superuser?: boolean
    is_verified?: boolean
    first_name: string
    last_name: string
    role: Roles
    category: CategoryData[]
    user_profiles: null | UsersProfileData[]
}

export interface UsersAddData {
    email: string
    first_name: string
    last_name: string
    role: Roles
    category?: number[]
}

export interface UserAllQueryParams {
    first_name: string
    last_name: string
    email: string
    role: Roles
    is_active: boolean
    ordering: string
    search: string
}

export type UsersPatchPayload = PatchPayload<UsersAddData>

export type UsersResponse = Response<User>
