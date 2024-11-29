import { api } from '..'

import { embs } from '../ebms/ebms'
import type {
    EBMSItemsQueryParams,
    OrderItemsQueryParams,
    OrdersQueryParams
} from '../ebms/ebms.types'
import type { FlowData } from '../flows/flows.types'

import { store } from '@/store'
import type {
    ItemAddData,
    ItemData,
    ItemPatchPayload,
    ItemsPatchCuttingCompleteData
} from './items.types'

export const items = api.injectEndpoints({
    endpoints: (build) => ({
        addOrderItem: build.mutation<void, Partial<ItemAddData>>({
            query: (data) => ({
                url: `items/`,
                method: 'POST',
                body: data
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                const queryParams = store.getState().orders.currentQueryParams

                const patchResult = dispatch(
                    embs.util.updateQueryData(
                        'getOrders',
                        queryParams as OrderItemsQueryParams,
                        (draft) => {
                            const itemToAdd: ItemData = {
                                id: Math.random() * 1000,
                                order: Math.random() * 1000,
                                origin_item: (Math.random() * 1000).toString(),
                                flow: {
                                    id: data.flow!,
                                    name: data?.flowName!,
                                    stages: [],
                                    category: ''
                                },
                                production_date: '',
                                priority: {
                                    id: data?.priority!,
                                    position: 0,
                                    name: '',
                                    color: ''
                                },
                                time: '',
                                packages: 0,
                                location: 0,
                                comments: [],
                                stage: {
                                    id: Math.random() * 1000,
                                    name: '',
                                    position: 1,
                                    item_ids: [],
                                    flow: 1,
                                    color: ''
                                }
                            }

                            const order = draft.results.find(
                                (order) => order.id === data.order
                            )

                            const originItem = order?.origin_items.find(
                                (item) => item.id === data.origin_item
                            )

                            if (originItem) {
                                Object.assign(originItem, {
                                    item: itemToAdd
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
            invalidatesTags: ['Items', 'Orders', 'EBMSItems']
        }),
        addItem: build.mutation<ItemData, Partial<ItemAddData>>({
            query: (data) => ({
                url: `items/`,
                method: 'POST',
                body: data
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                const queryParams = store.getState().orders.currentQueryParams

                const patchResult = dispatch(
                    embs.util.updateQueryData(
                        'getItems',
                        queryParams as OrderItemsQueryParams,
                        (draft) => {
                            const itemToAdd: ItemData = {
                                id: Math.random() * 1000,
                                order: Math.random() * 1000,
                                origin_item: (Math.random() * 1000).toString(),
                                flow: {
                                    id: data?.flow!,
                                    name: data?.flowName!,
                                    stages: [],
                                    category: ''
                                },
                                time: data.time!,
                                production_date: data?.production_date!,
                                priority: {
                                    id: data?.priority!,
                                    position: 0,
                                    name: '',
                                    color: ''
                                },
                                packages: data?.packages!,
                                location: data?.location!,
                                comments: [],
                                stage: null
                            }

                            const item = draft.results.find(
                                (item) => item.id === data.origin_item
                            )

                            if (item?.id) {
                                Object.assign(item, {
                                    item: itemToAdd
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
            invalidatesTags: ['Items', 'Orders', 'EBMSItems']
        }),
        patchOrderItem: build.mutation<void, ItemPatchPayload>({
            query: ({ data, id }) => ({
                url: `items/${id}/`,
                method: 'PATCH',
                body: data
            }),
            async onQueryStarted(
                { data, stageColor, stageName, id },
                { dispatch, queryFulfilled }
            ) {
                const queryParams = store.getState().orders.currentQueryParams

                const patchResult = dispatch(
                    embs.util.updateQueryData(
                        'getOrders',
                        queryParams as OrdersQueryParams,
                        (draft) => {
                            const order = draft.results.find(
                                (order) => order.id === data.order
                            )

                            const item = order?.origin_items.find(
                                (item) => item.item.id === id
                            )

                            const flowToPatch: FlowData = {
                                id: data.flow!,
                                name: data.flowName!,
                                category: '',
                                stages: []
                            }

                            if (stageName && stageColor) {
                                Object.assign(data, {
                                    stage: {
                                        id: data.stage!,
                                        name: stageName!,
                                        color: stageColor!
                                    }
                                })
                            }

                            if (data.flowName && item?.item) {
                                Object.assign(item?.item, {
                                    ...data,
                                    flow: flowToPatch,
                                    stage: null
                                })
                            }
                            // else if (item?.item) {
                            //     Object.assign(item?.item, {
                            //         ...data,
                            //         stage: null
                            //     })
                            // }
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: ['Items', 'Orders', 'EBMSItems', 'Categories', 'Capacities']
        }),
        patchItem: build.mutation<ItemData, ItemPatchPayload>({
            query: ({ data, id }) => ({
                url: `items/${id}/`,
                method: 'PATCH',
                body: data
            }),
            async onQueryStarted(
                { data, stageColor, stageName, id },
                { dispatch, queryFulfilled }
            ) {
                const queryParams = store.getState().orders.currentQueryParams

                const patchResult = dispatch(
                    embs.util.updateQueryData(
                        'getItems',
                        queryParams as EBMSItemsQueryParams,
                        (draft) => {
                            const item = draft.results.find(
                                (item) => item.item?.id === id
                            )

                            const flowToPatch: FlowData = {
                                id: data.flow!,
                                name: data.flowName!,
                                category: '',
                                stages: []
                            }

                            const dataToPatch = {
                                ...data
                            }

                            if (stageName && stageColor) {
                                Object.assign(dataToPatch, {
                                    stage: {
                                        id: data.stage!,
                                        name: stageName!,
                                        color: stageColor!
                                    }
                                })
                            }

                            if (data?.flowName && item?.item) {
                                Object.assign(item?.item, {
                                    ...data,
                                    flow: flowToPatch,
                                    stage: null
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
            invalidatesTags: ['Items', 'Orders', 'EBMSItems', 'Categories', 'Capacities']
        }),
        resetItemStages: build.mutation<void, number>({
            query: (id) => ({
                url: `items/${id}/rest-stages/`,
                method: 'DELETE'
            }),

            invalidatesTags: ['Items', 'EBMSItems', 'Orders']
        }),
        patchItemCuttingComplete: build.mutation<void, ItemsPatchCuttingCompleteData>({
            query: ({ data, autoid }) => ({
                url: `items/${autoid}/complete/`,
                method: 'PATCH',
                body: data
            }),

            invalidatesTags: ['CuttingItems']
        })
    })
})

export const {
    useAddItemMutation,
    usePatchOrderItemMutation,
    usePatchItemCuttingCompleteMutation,
    useAddOrderItemMutation,
    usePatchItemMutation,
    useResetItemStagesMutation
} = items
