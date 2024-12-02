import { api } from '..'

import type {
    EBMSItemsQueryParams,
    EBMSItemsResponse,
    EBMSOrdersPatchPayload,
    MFGPatchPayload,
    OrderQueryParams,
    OrdersData,
    OrdersQueryParams,
    OrdersResponse
} from './ebms.types'
import { store } from '@/store'
import { getQueryParamString } from '@/utils/get-query-param-string'

export const embs = api.injectEndpoints({
    endpoints: (build) => ({
        getOrders: build.query<OrdersResponse, Partial<OrdersQueryParams>>({
            query: (params) => {
                const queryString = getQueryParamString(params)
                return `ebms/orders/?${queryString}`
            },
            providesTags: ['Orders']
        }),
        getOrder: build.query<OrdersData, Partial<OrderQueryParams>>({
            query: ({ autoid }) => `ebms/orders/${autoid}/`
        }),
        getItems: build.query<EBMSItemsResponse, Partial<EBMSItemsQueryParams>>({
            query: (params) => {
                const queryString = getQueryParamString(params)

                return `ebms/items/?${queryString}`
            },
            providesTags: ['EBMSItems']
        }),
        patchEBMSOrders: build.mutation<void, EBMSOrdersPatchPayload>({
            query: ({ data, id }) => ({
                url: `ebms/orders/${id}/`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Comments']
        }),
        patchItemMFG: build.mutation<void, MFGPatchPayload>({
            query: ({ id, data }) => ({
                url: `ebms/items/${id}/`,
                method: 'PATCH',
                body: data
            }),
            async onQueryStarted({ data, id }, { dispatch, queryFulfilled }) {
                const queryKeyParams = store.getState().orders.currentQueryParams

                const patchResult = dispatch(
                    embs.util.updateQueryData(
                        'getItems',
                        queryKeyParams as EBMSItemsQueryParams,
                        (draft) => {
                            const item = draft.results.find((item) => item.id === id)

                            if (item) {
                                Object.assign(item, {
                                    ...item,
                                    c_mfg: data.c_mfg
                                })
                            }
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: ['EBMSItems']
        }),
        patchMFG: build.mutation<void, MFGPatchPayload>({
            query: ({ id, data }) => ({
                url: `ebms/items/${id}/`,
                method: 'PATCH',
                body: data
            }),
            async onQueryStarted(
                { data, origin_order, id },
                { dispatch, queryFulfilled }
            ) {
                const queryKeyParams = store.getState().orders.currentQueryParams

                const patchResult = dispatch(
                    embs.util.updateQueryData(
                        'getOrders',
                        queryKeyParams as OrdersQueryParams,
                        (draft) => {
                            const order = draft.results?.find(
                                (order) => order?.id === origin_order
                            )

                            const item = order?.origin_items.find(
                                (item) => item.id === id
                            )

                            if (item) {
                                Object.assign(item, {
                                    ...item,
                                    c_mfg: data.c_mfg
                                })
                            }
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: ['Orders']
        })
    })
})

export const {
    useGetOrderQuery,
    useLazyGetOrderQuery,
    useGetOrdersQuery,
    useGetItemsQuery,
    usePatchEBMSOrdersMutation,
    usePatchItemMFGMutation,
    usePatchMFGMutation
} = embs
