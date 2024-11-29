import { format, isSameMonth, isToday, isWeekend } from 'date-fns'

import type { CalendarResponse } from '@/api/ebms/calendar/calendar.types'
import type { CapacityCategory } from '@/api/ebms/ebms.types'
import { useGetCompanyProfilesQuery } from '@/api/profiles/profiles'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Capacity } from './calendar-capacity'

export const CalendarDay = ({
    date,
    firstDayCurrentMonth,
    calendarData,
    isFetching,
    category
}: {
    date: Date
    firstDayCurrentMonth: Date
    calendarData: CalendarResponse
    isFetching: boolean
    category: CapacityCategory
}) => {
    const isDisabled = isWeekend(date)

    const { data } = useGetCompanyProfilesQuery()
    const isWorkingWeekend = data?.working_weekend

    const currentDate = format(date, 'yyyy-MM-dd')

    const capacity = calendarData?.[currentDate]?.[category]!
    const totalCapacity = calendarData?.capacity_data?.[category]!

    return (
        <div
            className={cn(
                'h-[90px]] flex max-h-[90px] min-w-[187px] flex-1 flex-col justify-between gap-y-2 rounded-sm border p-3',
                isToday(date) && 'border-primary',

                !isSameMonth(date, firstDayCurrentMonth) && 'opacity-50'
            )}>
            <span
                className={cn(
                    'self-end',
                    isToday(date) &&
                        'flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background'
                )}>
                {format(date, 'd')}
            </span>
            {isDisabled && !isWorkingWeekend ? (
                ''
            ) : isFetching ? (
                <Skeleton className='h-8 w-full' />
            ) : (
                <Capacity
                    dailyData={capacity}
                    totalCapacity={totalCapacity}
                />
            )}
        </div>
    )
}