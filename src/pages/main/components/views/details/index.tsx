import { useEffect, useMemo } from 'react'
import { BooleanParam, NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { columns } from './table/columns'
import { DetailsViewTable } from './table/table'
import { TableControls } from './table/table-controls'
import { useGetItemsQuery } from '@/api/ebms/ebms'
import type { EBMSItemsQueryParams } from '@/api/ebms/ebms.types'
import { useCurrentValue } from '@/hooks/use-current-value'
import { useWebSocket } from '@/hooks/use-web-socket'
import { useAppDispatch } from '@/store/hooks/hooks'
import { setCurrentQueryParams } from '@/store/slices/query-params'

export const DetailsView = () => {
    const [overdue] = useQueryParam('overdue', BooleanParam)
    const [completed] = useQueryParam('completed', BooleanParam)
    const [scheduled] = useQueryParam('scheduled', BooleanParam)
    const [offset] = useQueryParam('offset', NumberParam)
    const [limit] = useQueryParam('limit', NumberParam)
    const [search] = useQueryParam('search', StringParam)
    const [date] = useQueryParam('date', StringParam)
    const [flow] = useQueryParam('flow', StringParam)
    const [stage] = useQueryParam('stage', StringParam)
    const [category] = useQueryParam('category', StringParam)
    const [ordering] = useQueryParam('ordering', StringParam)

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

    const { currentData, isLoading, isFetching, refetch } = useGetItemsQuery(queryParams)

    const currentCount = useCurrentValue(currentData?.count)

    const pageCount = useMemo(
        () => (currentCount ? Math.ceil(currentCount! / limit!) : 1),
        [isLoading, limit, currentCount]
    )

    const { dataToRender } = useWebSocket({
        currentData: currentData?.results || [],
        endpoint: 'items',
        refetch
    })

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
        <>
            <TableControls />
            <DetailsViewTable
                columns={columns}
                data={dataToRender}
                isDataLoading={isLoading}
                isDataFetching={isFetching}
                pageCount={pageCount}
            />
        </>
    )
}
