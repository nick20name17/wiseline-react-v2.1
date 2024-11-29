import { api } from '..'

import { getQueryParamString } from '@/utils'
import type {
    FlowData,
    FlowsAddData,
    FlowsPatchPayload,
    FlowsQueryParams,
    FlowsResponse
} from './flows.types'

export const flows = api.injectEndpoints({
    endpoints: (build) => ({
        getFlows: build.query<FlowsResponse, Partial<FlowsQueryParams>>({
            query: (params) => {
                const queryParamsString = getQueryParamString(params)
                return `flows/?${queryParamsString}`
            },

            providesTags: ['Flows']
        }),
        getAllFlows: build.query<FlowData[], Partial<FlowsQueryParams>>({
            query: (params) => {
                const queryString = getQueryParamString(params)
                return `flows/all/?${queryString}`
            },
            providesTags: ['Flows']
        }),
        addFlow: build.mutation<void, FlowsAddData>({
            query: (data) => ({
                url: `flows/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Flows', 'Stage', 'Categories']
        }),
        patchFlow: build.mutation<void, FlowsPatchPayload>({
            query: ({ data, id }) => ({
                url: `flows/${id}/`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Flows', 'Categories']
        }),
        removeFlow: build.mutation<void, number>({
            query: (id) => ({
                url: `flows/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Flows', 'Categories', 'Stage']
        })
    })
})

export const {
    useGetFlowsQuery,
    useGetAllFlowsQuery,
    useAddFlowMutation,
    usePatchFlowMutation,
    useRemoveFlowMutation
} = flows
