import { configureStore } from '@reduxjs/toolkit'

import { listenerMiddleware } from './middleware/auth'
import { authReducer } from './slices/auth'
import { queryParams } from './slices/query-params'
import { api } from '@/api'

export const store = configureStore({
    reducer: {
        orders: queryParams.reducer,
        [api.reducerPath]: api.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(api.middleware)
            .prepend(listenerMiddleware.middleware),
    devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
