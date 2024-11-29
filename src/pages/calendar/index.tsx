import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    parse,
    startOfToday,
    startOfWeek
} from 'date-fns'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useGetCalendarQuery } from '@/api/ebms/calendar/calendar'
import type { CapacityCategory } from '@/api/ebms/ebms.types'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useQueryState } from 'nuqs'
import { CalendarBody } from './components/calendar-body'
import { Categories } from './components/filters/categories'
import { Weeks } from './components/weeks'

export const CalendarPage = () => {
    const today = startOfToday()

    const [category] = useQueryState('category')
    const [monthQuery, setMonthQuery] = useQueryState('month')
    const [yearQuery, setYearQuery] = useQueryState('year')

    const initialDate =
        monthQuery && yearQuery
            ? parse(`${yearQuery} ${monthQuery}`, 'yyyy M', new Date())
            : today
    const [currentDate, setCurrentDate] = useState(format(initialDate, 'MMM yyyy'))

    const firstDayCurrentMonth = parse(currentDate, 'MMM yyyy', new Date())

    useEffect(() => {
        if (monthQuery && yearQuery) {
            const dateFromQuery = parse(
                `${yearQuery} ${monthQuery}`,
                'yyyy M',
                new Date()
            )
            setCurrentDate(format(dateFromQuery, 'MMM yyyy'))
        } else {
            const firstDayCurrentMonth = parse(currentDate, 'MMM yyyy', new Date())
            setMonthQuery(format(firstDayCurrentMonth, 'M'))
            setYearQuery(format(firstDayCurrentMonth, 'yyyy'))
        }
    }, [monthQuery, yearQuery])

    const getNextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentDate(format(firstDayNextMonth, 'MMM yyyy'))
        setMonthQuery(format(firstDayNextMonth, 'M'))
        setYearQuery(format(firstDayNextMonth, 'yyyy'))
    }

    const getPreviousMonth = () => {
        const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentDate(format(firstDayPreviousMonth, 'MMM yyyy'))
        setMonthQuery(format(firstDayPreviousMonth, 'M'))
        setYearQuery(format(firstDayPreviousMonth, 'yyyy'))
    }

    const getCurrentMonthDays = () => {
        return eachDayOfInterval({
            start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 0 }),
            end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 0 })
        })
    }

    const { data: calendarData, isFetching } = useGetCalendarQuery({
        month: +format(firstDayCurrentMonth, 'M'),
        year: +format(firstDayCurrentMonth, 'yyyy')
    })

    useEffect(() => {
        setMonthQuery(format(firstDayCurrentMonth, 'M'))
        setYearQuery(format(firstDayCurrentMonth, 'yyyy'))
    }, [currentDate])

    return (
       <>
       <Header title='Production Calendar'/>
        <section className='px-4'>
            <div className='flex flex-wrap-reverse items-center justify-between gap-4 py-3'>
                <Categories />
                <div className='flex w-48 items-center justify-between gap-x-4 max-[440px]:w-full'>
                    <Button
                        onClick={getPreviousMonth}
                        variant='outline'
                        size='icon'
                    >
                        <ArrowLeft />
                    </Button>

                    <h1 className='scroll-m-20 font-bold'>
                        {format(firstDayCurrentMonth, 'MMM yyyy')}
                    </h1>

                    <Button
                        onClick={getNextMonth}
                        variant='outline'
                        size='icon'
                    >
                        <ArrowRight />
                    </Button>
                </div>
            </div>

            <ScrollArea className='!w-full'>
                <Weeks />
                <CalendarBody
                    category={category as CapacityCategory}
                    calendarData={calendarData!}
                    isFetching={isFetching}
                    currentDays={getCurrentMonthDays()}
                    firstDayCurrentMonth={firstDayCurrentMonth}
                />
                <ScrollBar orientation='horizontal'/>
            </ScrollArea>
        </section>

       </>
    )
}

