import { useQueryState } from 'nuqs'
import { useEffect, useMemo } from 'react'

import { columns } from './table/columns'
import { DetailsViewTable } from './table/table'
import { TableControls } from './table/table-controls'
import { useGetItemsQuery } from '@/api/ebms/ebms'
import type { EBMSItemsQueryParams } from '@/api/ebms/ebms.types'
import { useCurrentValue } from '@/hooks/use-current-value'
import { useAppDispatch } from '@/store/hooks/hooks'
import { setCurrentQueryParams } from '@/store/slices/query-params'

export const DetailsView = () => {
    const [overdue] = useQueryState('overdue', {
        parse: Boolean
    })
    const [completed] = useQueryState('completed', {
        parse: Boolean
    })
    const [scheduled] = useQueryState('scheduled', {
        parse: Boolean
    })
    const [search] = useQueryState('search')
    const [offset] = useQueryState('offset', {
        parse: Number
    })
    const [limit] = useQueryState('limit', {
        parse: Number
    })
    const [date] = useQueryState('date')
    const [flow] = useQueryState('flow')
    const [stage] = useQueryState('stage')
    const [category] = useQueryState('category')
    const [ordering] = useQueryState('ordering')

    const queryParams: Partial<EBMSItemsQueryParams> = {
        offset: offset!,
        limit: limit!,
        ordering: ordering!,
        search: search!,
        flow_id: flow!,
        is_scheduled: scheduled!,
        category: category === 'All' ? undefined : category!,
        completed: completed!,
        over_due: overdue!,
        stage_id: stage ? stage! : undefined,
        production_date: date ? date : undefined
    }

    const { currentData, isLoading, isFetching } = useGetItemsQuery(queryParams)

    const currentCount = useCurrentValue(currentData?.count)

    const pageCount = useMemo(
        () => (currentCount ? Math.ceil(currentCount! / limit!) : 1),
        [isLoading, limit, currentCount]
    )

    // const { dataToRender } = useWebSocket({
    //     currentData: currentData?.results || [],
    //     endpoint: 'items',
    //     refetch
    // })

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setCurrentQueryParams(queryParams as EBMSItemsQueryParams))
    }, [
        overdue,
        completed,
        scheduled,
        search,
        flow,
        stage,
        date,
        flow,
        category,
        ordering
    ])

    return (
        <section className='mt-4 px-4'>
            <TableControls />
            <DetailsViewTable
                columns={columns}
                data={currentData?.results || []}
                isDataLoading={isLoading}
                isDataFetching={isFetching}
                pageCount={pageCount}
            />
        </section>
    )
}
