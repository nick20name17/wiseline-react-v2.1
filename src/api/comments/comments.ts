import { api } from '..'

import { embs } from '../ebms/ebms'
import type { EBMSItemsQueryParams, OrdersQueryParams } from '../ebms/ebms.types'
import type { ItemData } from '../items/items.types'
import type { User } from '../users/users.types'

import type { BaseQueryParams } from '@/api/types/query'
import { type RootState, store } from '@/store/index'
import type {
    CommentsAddData,
    CommentsData,
    CommentsPatchPayload,
    CommentsResponse
} from './comments.types'

export const comments = api.injectEndpoints({
    endpoints: (build) => ({
        getComments: build.query<CommentsResponse, Partial<BaseQueryParams>>({
            query: (params) => ({
                url: 'comments/',
                params
            }),
            providesTags: ['Comments']
        }),
        getComment: build.query<CommentsData, number>({
            query: (id) => `comments/${id}`,
            providesTags: ['Comments']
        }),
        addOrderComment: build.mutation<void, CommentsAddData>({
            query: (data) => ({
                url: `comments/`,
                method: 'POST',
                body: data
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled, getState }) {
                const { role, category, ...userDataToPatch } = (getState() as RootState)
                    ?.auth?.user as User

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
                                (item) => item.id === data.item
                            )

                            const dataToPatch: CommentsData = {
                                item: data.item,
                                text: data.text,
                                user: userDataToPatch,
                                id: Math.floor(Math.random() * 1000),
                                created_at: new Date().toISOString()
                            }

                            if (item?.item) {
                                item?.item?.comments.push(dataToPatch)
                            } else {
                                const itemToPatch: ItemData = {
                                    id: Math.floor(Math.random() * 1000),
                                    origin_item: Math.floor(
                                        Math.random() * 1000
                                    ).toString(),
                                    flow: {
                                        id: Math.floor(Math.random() * 1000),
                                        name: '',
                                        category: '',
                                        stages: []
                                    },
                                    time: '',
                                    comments: [dataToPatch],
                                    order: Math.floor(Math.random() * 1000),
                                    priority: {
                                        id: Math.floor(Math.random() * 1000),
                                        name: '',
                                        color: '',
                                        position: 0
                                    },
                                    packages: 0,
                                    location: 0,
                                    production_date: '',
                                    stage: null
                                }

                                Object.assign(item!, {
                                    item: itemToPatch
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

            invalidatesTags: ['Comments', 'Orders', 'Items']
        }),
        addItemComment: build.mutation<void, CommentsAddData>({
            query: (data) => ({
                url: `comments/`,
                method: 'POST',
                body: data
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled, getState }) {
                const { role, category, ...userDataToPatch } = (getState() as RootState)
                    ?.auth?.user as User

                const queryParams = store.getState().orders.currentQueryParams

                const dataToPatch: CommentsData = {
                    item: data.item,
                    text: data.text,
                    user: userDataToPatch,
                    id: Math.floor(Math.random() * 1000),
                    created_at: new Date().toISOString()
                }

                const patchResult = dispatch(
                    embs.util.updateQueryData(
                        'getItems',
                        queryParams as EBMSItemsQueryParams,
                        (draft) => {
                            const item = draft.results.find(
                                (item) => item.id === data.item
                            )

                            if (item?.item) {
                                item?.item?.comments.push(dataToPatch)
                            } else {
                                const itemToPatch: ItemData = {
                                    id: Math.floor(Math.random() * 1000),
                                    origin_item: Math.floor(
                                        Math.random() * 1000
                                    ).toString(),
                                    flow: {
                                        id: Math.floor(Math.random() * 1000),
                                        name: '',
                                        stages: [],
                                        category: ''
                                    },
                                    time: '',
                                    comments: [dataToPatch],
                                    order: Math.floor(Math.random() * 1000),
                                    priority: {
                                        id: Math.floor(Math.random() * 1000),
                                        name: '',
                                        color: '',
                                        position: 0
                                    },
                                    packages: 0,
                                    location: 0,
                                    production_date: '',
                                    stage: null
                                }

                                Object.assign(item!, {
                                    item: itemToPatch
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
            invalidatesTags: ['Comments', 'Orders', 'Items']
        }),
        patchComment: build.mutation<void, CommentsPatchPayload>({
            query: ({ data, id }) => ({
                url: `comments/${id}/`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Comments']
        }),
        removeComment: build.mutation<void, number>({
            query: (id) => ({
                url: `comments/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Comments']
        })
    })
})

export const {
    useGetCommentsQuery,
    useGetCommentQuery,
    useAddOrderCommentMutation,
    useAddItemCommentMutation,
    usePatchCommentMutation,
    useRemoveCommentMutation
} = comments
