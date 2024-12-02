import { useEffect, useMemo } from 'react'
import { BooleanParam, NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { setCurrentQueryParams } from '../store/orders'

import { columns } from './table/columns'
import { AllOrdersViewTable2 } from './table/table2'
import { TableControls } from './table/table-controls'
import { useCurrentValue, useWebSocket } from '@/hooks'
import { useGetOrdersQuery } from '@/store/api/ebms/ebms'
import type { OrdersQueryParams } from '@/store/api/ebms/ebms.types'
import { useAppDispatch } from '@/store/hooks/hooks'

export const AllOrdersView = () => {
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
            <AllOrdersViewTable2
                columns={columns}
                data={dataToRender}
                isDataLoading={isLoading}
                isDataFetching={isFetching}
                pageCount={pageCount}
            />
        </>
    )
}
