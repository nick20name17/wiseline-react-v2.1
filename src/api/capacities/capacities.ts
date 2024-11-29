import { api } from '..'

import type { BaseQueryParams } from '@/api/types/query'
import type {
    CapacitiesAddData,
    CapacitiesData,
    CapacitiesPatchPayload,
    CapacitiesResponse
} from './capacities.types'

export const capacities = api.injectEndpoints({
    endpoints: (build) => ({
        getCapacities: build.query<CapacitiesResponse, BaseQueryParams>({
            query: (params) => ({
                url: 'capacities/',
                params
            }),
            providesTags: ['Capacities']
        }),
        getCapacity: build.query<CapacitiesData, number>({
            query: (id) => `capacities/${id}`,
            providesTags: ['Capacities']
        }),
        addCapacity: build.mutation<void, CapacitiesAddData>({
            query: (data) => ({
                url: `capacities/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Capacities', 'Flows', 'Categories', 'Calendar']
        }),
        patchCapacity: build.mutation<void, CapacitiesPatchPayload>({
            query: ({ data, id }) => ({
                url: `capacities/${id}/`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Capacities', 'Flows', 'Categories', 'Calendar']
        }),
        removeCapacity: build.mutation<void, number>({
            query: (id) => ({
                url: `capacities/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Capacities', 'Flows', 'Categories']
        })
    })
})

export const {
    useGetCapacitiesQuery,
    useGetCapacityQuery,
    useAddCapacityMutation,
    usePatchCapacityMutation,
    useRemoveCapacityMutation
} = capacities
