import type { EBMSItemsQueryParams, OrdersQueryParams } from '@/api/ebms/ebms.types'
import { type PayloadAction, createSlice } from '@reduxjs/toolkit'


type QueryKeyParams = Partial<OrdersQueryParams | EBMSItemsQueryParams> | {}

export interface QueryParamsState {
    currentQueryParams: QueryKeyParams
}

const initialState: QueryParamsState = {
    currentQueryParams: {}
}

export const queryParams = createSlice({
    name: 'queryParams',
    initialState,
    reducers: {
        setCurrentQueryParams(
            state,
            action: PayloadAction<QueryKeyParams>
        ) {
            state.currentQueryParams = action.payload
        }
    }
})

export const { setCurrentQueryParams } = queryParams.actions
