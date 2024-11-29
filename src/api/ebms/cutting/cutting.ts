import { api } from '../..'

import { getQueryParamString } from '@/utils/get-query-param-string'
import type {
    ColorsData,
    CuttingItem,
    CuttingItemQueryParams,
    CuttingItemResponse
} from './cutting.types'

export const cutting = api.injectEndpoints({
    endpoints: (build) => ({
        getCuttingItems: build.query<CuttingItem[], Partial<CuttingItemQueryParams>>({
            query: (params) => {
                const queryString = getQueryParamString(params)
                return `ebms/items/cutting?${queryString}`
            },
            providesTags: ['CuttingItems']
        }),
        getCuttingViewItems: build.query<
            CuttingItemResponse,
            Partial<CuttingItemQueryParams>
        >({
            query: (params) => {
                const queryString = getQueryParamString(params)
                return `ebms/items/cutting-view/?${queryString}`
            },
            providesTags: ['CuttingItems']
        }),
        getColors: build.query<ColorsData, void>({
            query: () => {
                return `ebms/items/values/?get_values=colors`
            }
        })
    })
})

export const { useGetColorsQuery, useGetCuttingItemsQuery, useGetCuttingViewItemsQuery } =
    cutting
