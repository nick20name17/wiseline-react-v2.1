import { api } from '../..'

import { getQueryParamString } from '@/utils/get-query-param-string'
import type {
    AllCategoriesData,
    CategoriesQueryParams,
    CategoriesResponse
} from './categories.types'

export const categories = api.injectEndpoints({
    endpoints: (build) => ({
        getCategories: build.query<CategoriesResponse, Partial<CategoriesQueryParams>>({
            query: (params) => {
                const queryString = getQueryParamString(params)
                return `ebms/categories/?${queryString}`
            },
            providesTags: ['Categories']
        }),
        getAllCategories: build.query<AllCategoriesData[], void>({
            query: () => 'ebms/categories/all/',
            providesTags: ['Categories']
        })
    })
})

export const { useGetCategoriesQuery, useGetAllCategoriesQuery } = categories
