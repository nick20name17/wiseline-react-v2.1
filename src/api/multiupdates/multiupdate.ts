import { api } from '..'

import { embs } from '../ebms/ebms'
import type { EBMSItemsQueryParams, OrdersQueryParams } from '../ebms/ebms.types'
import type { FlowData } from '../flows/flows.types'

import type { MultiPatchItemsData, MultiPatchOrdersData } from './multiupdate.types'
import { store } from '@/store'

export const multiupdate = api.injectEndpoints({
    endpoints: (build) => ({
        multiPatchItems: build.mutation<MultiPatchItemsData, MultiPatchItemsData>({
            query: (data) => ({
                url: `multiupdate/items/`,
                method: 'POST',
                body: data
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                const queryParams = store.getState().orders.currentQueryParams

                const patchResult = dispatch(
                    embs.util.updateQueryData(
                        'getItems',
                        queryParams as EBMSItemsQueryParams,
                        (draft) => {
                            const originItemsIds = data.origin_items

                            const items = draft.results.filter((item) => {
                                return originItemsIds.includes(item.id)
                            })

                            const flowToPatch: FlowData = {
                                id: data.flow!,
                                name: data.flowName!,
                                category: '',
                                stages: []
                            }

                            items.forEach((item) => {
                                if (item?.item) {
                                    Object.assign(item, {
                                        item: {
                                            ...item.item,
                                            flow: flowToPatch,
                                            stage: null
                                        }
                                    })
                                }
                            })
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: [
                'Items',
                'Orders',
                'EBMSItems',
                'Items',
                'Categories',
                'Capacities'
            ]
        }),
        multiPatchOrders: build.mutation<MultiPatchOrdersData, MultiPatchOrdersData>({
            query: (data) => ({
                url: `multiupdate/orders/`,
                method: 'POST',
                body: data
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                const queryParams = store.getState().orders.currentQueryParams

                const patchResult = dispatch(
                    embs.util.updateQueryData(
                        'getOrders',
                        queryParams as OrdersQueryParams,
                        (draft) => {
                            const originOrdersIds = data.origin_orders

                            const items = draft.results.filter((item) => {
                                return originOrdersIds.includes(item.id)
                            })

                            items.forEach((item) => {
                                if (item && data.ship_date) {
                                    Object.assign(item, {
                                        ship_date: data.ship_date
                                    })
                                }

                                if (item?.sales_order && data?.production_date) {
                                    Object.assign(item.sales_order, data)
                                } else if (data?.production_date) {
                                    const salesOrder = {
                                        id: Math.random(),
                                        ...data
                                    }

                                    Object.assign(item, {
                                        sales_order: salesOrder
                                    })
                                }
                            })
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: [
                'Items',
                'Orders',
                'EBMSItems',
                'Items',
                'Categories',
                'Capacities'
            ]
        })
    })
})

export const { useMultiPatchItemsMutation, useMultiPatchOrdersMutation } = multiupdate
