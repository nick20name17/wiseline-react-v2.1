import { api } from '..'

import type {
    PrioritiesAddData,
    PrioritiesData,
    PrioritiesPatchPayload
} from './priorities.types'

export const priorities = api.injectEndpoints({
    endpoints: (build) => ({
        getPriorities: build.query<PrioritiesData[], void>({
            query: () => 'priorities/',
            providesTags: ['Priorities']
        }),
        addPriority: build.mutation<void, PrioritiesAddData>({
            query: (data) => ({
                url: 'priorities/',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Priorities'],
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    priorities.util.updateQueryData(
                        'getPriorities',
                        undefined,
                        (draft) => {
                            const newPriority = { ...data, id: Math.random() * 10 }
                            draft.push(newPriority)
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        }),
        patchPriority: build.mutation<void, PrioritiesPatchPayload>({
            query: ({ data, id }) => ({
                url: `priorities/${id}/`,
                method: 'PATCH',
                body: data
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    priorities.util.updateQueryData(
                        'getPriorities',
                        undefined,
                        (draft) => {
                            const priority = draft.find((item) => item.id === data.id)

                            if (priority) {
                                Object.assign(priority, {
                                    ...data.data
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
            invalidatesTags: ['Priorities']
        }),
        removePriority: build.mutation<void, number>({
            query: (id) => ({
                url: `priorities/${id}/`,
                method: 'DELETE'
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    priorities.util.updateQueryData(
                        'getPriorities',
                        undefined,
                        (draft) => {
                            const priority = draft.find((item) => item.id === id)

                            if (priority) {
                                const index = draft.indexOf(priority)
                                draft.splice(index, 1)
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
            invalidatesTags: ['Priorities']
        })
    })
})

export const {
    useGetPrioritiesQuery,
    useAddPriorityMutation,
    usePatchPriorityMutation,
    useRemovePriorityMutation
} = priorities
