import { api } from '../..'

import type { CalendarQueryParams, CalendarResponse } from './calendar.types'

export const calendar = api.injectEndpoints({
    endpoints: (build) => ({
        getCalendar: build.query<CalendarResponse, CalendarQueryParams>({
            query: ({ year, month }) => `ebms/calendar/${year}/${month}/`,
            providesTags: ['Calendar']
        })
    })
})

export const { useGetCalendarQuery } = calendar
