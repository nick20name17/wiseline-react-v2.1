import { useEffect, useMemo } from 'react'
import { BooleanParam, NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { columns } from './table/columns'
import { OrdersViewTable } from './table/table'
import { TableControls } from './table/table-controls'
import { useGetOrdersQuery } from '@/api/ebms/ebms'
import type { OrdersQueryParams } from '@/api/ebms/ebms.types'
import { useCurrentValue } from '@/hooks/use-current-value'
import { useWebSocket } from '@/hooks/use-web-socket'
import { useAppDispatch } from '@/store/hooks/hooks'
import { setCurrentQueryParams } from '@/store/slices/query-params'

export const OrdersView = () => {
    const [overdue] = useQueryParam('overdue', BooleanParam)
    const [completed] = useQueryParam('completed', BooleanParam)
    const [scheduled] = useQueryParam('scheduled', BooleanParam)
    const [search] = useQueryParam('search', StringParam)
    const [offset] = useQueryParam('offset', NumberParam)
    const [limit] = useQueryParam('limit', NumberParam)
    const [category] = useQueryParam('category', StringParam)
    const [flow] = useQueryParam('flow', StringParam)
    const [ordering] = useQueryParam('ordering', StringParam)

    const queryParams: Partial<OrdersQueryParams> = {
        limit: limit!,
        offset: offset!,
        is_scheduled: scheduled,
        ordering: ordering!,
        search,
        completed: completed,
        over_due: overdue!,
        category: category === 'All' ? undefined : category!,
        flow_id: flow ? +flow! : null
    }

    const { currentData, isLoading, isFetching, refetch } = useGetOrdersQuery(queryParams)

    const currentCount = useCurrentValue(currentData?.count)

    const pageCount = useMemo(
        () => (currentCount ? Math.ceil(currentCount! / limit!) : 1),
        [isLoading, limit, currentCount]
    )

    const { dataToRender } = useWebSocket({
        currentData: currentData?.results || [],
        endpoint: 'orders',
        refetch
    })

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setCurrentQueryParams(queryParams as OrdersQueryParams))
    }, [overdue, completed, scheduled, search, flow, flow, ordering, category])

    return (
        <>
            <TableControls />
            <OrdersViewTable
                columns={columns}
                data={dataToRender}
                isDataLoading={isLoading}
                isDataFetching={isFetching}
                pageCount={pageCount}
            />
        </>
    )
}
