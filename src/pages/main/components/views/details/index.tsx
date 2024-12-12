import { useCallback, useEffect, useMemo } from 'react'
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
    const [search] = useQueryParam('search', StringParam)
    const [offset] = useQueryParam('offset', NumberParam)
    const [limit] = useQueryParam('limit', NumberParam)
    const [date] = useQueryParam('date', StringParam)
    const [flow] = useQueryParam('flow', StringParam)
    const [stage] = useQueryParam('stage', StringParam)
    const [category] = useQueryParam('category', StringParam)
    const [ordering] = useQueryParam('ordering', StringParam)

    const queryParams = useMemo(
        () => ({
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
        }),
        [
            offset,
            limit,
            ordering,
            search,
            flow,
            scheduled,
            category,
            completed,
            overdue,
            stage,
            date
        ]
    )
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

    const dispatchQueryParams = useCallback(() => {
        dispatch(setCurrentQueryParams(queryParams as EBMSItemsQueryParams))
    }, [dispatch, queryParams])

    useEffect(() => {
        dispatchQueryParams()
    }, [dispatchQueryParams])

    const tableData = useMemo(() => dataToRender || [], [dataToRender])

    return (
        <>
            <TableControls />
            <DetailsViewTable
                columns={columns}
                data={tableData}
                isDataLoading={isLoading}
                isDataFetching={isFetching}
                pageCount={pageCount}
            />
        </>
    )
}
