import type { FetchBaseQueryMeta } from '@reduxjs/toolkit/query'
import type { User } from '../users/users.types'


export interface AccessToken {
    access: string
}

export interface RefreshToken {
    refresh: string
}

export interface LoginData {
    email: string
    password: string
}

export interface LoginResponse {
    access: string | null
    refresh: string | null
    user: User | null
}

export interface RefreshResponse {
    data: AccessToken
    meta: FetchBaseQueryMeta
}

export interface AuthState extends LoginResponse {
    isAuth: boolean
}
