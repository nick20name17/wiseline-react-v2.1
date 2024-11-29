import { useEffect } from 'react'

import { useGetCategoriesQuery } from '@/api/ebms/categories/categories'
import { useGetCompanyProfilesQuery } from '@/api/profiles/profiles'
import { Progress } from '@/components/ui/progress'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { FormattedDate } from '@/utils/get-work-days'
import { getWorkDays } from '@/utils/get-work-days'
import { useQueryState } from 'nuqs'

// const getColorClass = (percentage: number) => {
//     const colors = {
//         green: 'bg-green-500',
//         red: 'bg-red-500',
//         yellow: 'bg-yellow-500'
//     } as const

//     if (percentage < 50) return colors.green
//     if (percentage < 80) return colors.yellow
//     return colors.red
// }

export const WeekFilters = () => {
    const [view] = useQueryState('view')
    const [overdue, setOverdue] = useQueryState('overdue', {
        parse: Boolean
    })
    const [scheduled, setScheduled] = useQueryState('scheduled', {
        parse: Boolean
    })
    const [date, setDate] = useQueryState('date')

    const { data } = useGetCompanyProfilesQuery()

    const workingDays = getWorkDays(data?.working_weekend)

    const onValueChange = (value: string) => {
        if (!scheduled) {
            setScheduled(true)
        }

        setDate(value || null)
        setOverdue(null)
    }

    const showWeekFilters = view == 'lines' && scheduled !== undefined

    useEffect(() => {
        if (view == 'lines' && scheduled && !overdue) {
            setDate(date || workingDays[0].date || null)
        } else {
            setDate(null)
        }
    }, [scheduled, view, date, overdue])

    return showWeekFilters ? (
        <ScrollArea className='whitespace-nowrap max-xl:w-[500px] max-lg:w-96 max-md:w-80'>
            <div className='flex items-center gap-x-1 gap-y-10 overflow-x-scroll p-0.5 max-[1118px]:w-full'>
                <ToggleGroup
                    key={date!}
                    defaultValue={date!}
                    onValueChange={onValueChange}
                    type='single'>
                    {workingDays.map((date) => (
                        <WeekFilter
                            key={date.date}
                            {...date}
                        />
                    ))}
                </ToggleGroup>
            </div>
            <ScrollBar
                className='h-2'
                orientation='horizontal'
            />
        </ScrollArea>
    ) : null
}

const WeekFilter: React.FC<FormattedDate> = ({ date, dateToDisplay }) => {
    const [category] = useQueryState('category')

    const { data, isLoading } = useGetCategoriesQuery({
        production_date: date
    })

    const currentCategory = data?.results?.find(
        (dataCategory) => dataCategory.name === category
    )

    const { capacity, total_capacity } = currentCategory || {}

    const currentPercentage = ((total_capacity ?? 0) / capacity!) * 100 || 0

    // const currentColorClass = getColorClass(currentPercentage)


    return (
        <ToggleGroupItem
            value={date}
            className='data-[state=on]:shadow-custom flex h-9 w-[176px] flex-col gap-1 bg-secondary px-1 py-1.5 text-xs text-secondary-foreground shadow-foreground -outline-offset-1 data-[state=on]:outline data-[state=on]:outline-1 data-[state=on]:outline-foreground max-[1118px]:flex-1'>
            {isLoading ? (
                <Skeleton className='h-5 w-full' />
            ) : (
                <span className='font-medium'>
                    {dateToDisplay}{' '}
                    {category === 'Rollforming' || category === 'Trim' ? (
                        <>
                            ({total_capacity ?? '0'} / {capacity ?? '0'})
                        </>
                    ) : null}
                </span>
            )}

            {category === 'Rollforming' || category === 'Trim' ? (
                <Progress
                    // indicatorClassName={currentColorClass}
                    className='h-1 w-[80%] bg-neutral-200'
                    value={currentPercentage > 100 ? 100 : currentPercentage}
                />
            ) : null}
        </ToggleGroupItem>
    )
}
