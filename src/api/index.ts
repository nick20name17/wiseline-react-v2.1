import {
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react'

import type { User } from './users/users.types'
import type {
    AccessToken,
    LoginData,
    LoginResponse,
    RefreshResponse,
    RefreshToken
} from '@/api/types/auth'
import { apiBaseUrl } from '@/config/app'
import type { RootState } from '@/store'
import { logout, tokenUpdated } from '@/store/slices/auth'

const baseQuery = fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
        const getAccessToken = () => {
            const stateToken = (getState() as RootState).auth.access
            const tokenFromStorage =
                localStorage.getItem('token') || sessionStorage.getItem('token')

            const parsedToken = tokenFromStorage
                ? (JSON.parse(tokenFromStorage) as AccessToken)?.access
                : null

            return stateToken || parsedToken
        }

        const token = getAccessToken()

        if (token && token !== null) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        const token = localStorage.getItem('token') ?? sessionStorage.getItem('token')
        const refresh = token !== null ? (JSON.parse(token) as RefreshToken)?.refresh : ''

        const refreshResult = (await baseQuery(
            {
                url: 'token/refresh/',
                method: 'POST',
                body: JSON.stringify({ refresh }),
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            api,
            extraOptions
        )) as RefreshResponse

        if (refreshResult?.data) {
            const { access } = refreshResult?.data
            api.dispatch(tokenUpdated({ access }))

            if (localStorage.getItem('token')) {
                localStorage.setItem('token', JSON.stringify({ access, refresh }))
            } else {
                sessionStorage.setItem('token', JSON.stringify({ access, refresh }))
            }

            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }

    return result
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        login: build.mutation<LoginResponse, LoginData>({
            query: (body) => ({
                url: 'token/',
                method: 'POST',
                body
            })
        }),
        getUser: build.query<User, number>({
            query: (id) => `users/${id}/`,
            providesTags: ['Users']
        })
    }),
    tagTypes: [
        'CompanyProfile',
        'UsersProfile',
        'Comments',
        'Flows',
        'Orders',
        'SalesOrders',
        'Stage',
        'Priorities',
        'Items',
        'Users',
        'Categories',
        'Capacities',
        'EBMSItems',
        'Calendar',
        'CuttingItems'
    ]
})

export const {
    useLoginMutation,
    endpoints: { login, getUser }
} = api
