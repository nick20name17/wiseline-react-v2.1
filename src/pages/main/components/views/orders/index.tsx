import { useQueryState } from 'nuqs'
import { useEffect, useMemo } from 'react'

import { columns } from './table/columns'
import { OrdersViewTable } from './table/table'
import { TableControls } from './table/table-controls'
import { useGetOrdersQuery } from '@/api/ebms/ebms'
import type { OrdersQueryParams } from '@/api/ebms/ebms.types'
import { useCurrentValue } from '@/hooks/use-current-value'
import { useAppDispatch } from '@/store/hooks/hooks'
import { setCurrentQueryParams } from '@/store/slices/query-params'

export const OrdersView = () => {
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
    const [category] = useQueryState('category')
    const [flow] = useQueryState('flow')
    const [ordering] = useQueryState('ordering')

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

    const { currentData, isLoading, isFetching } = useGetOrdersQuery(queryParams)

    const currentCount = useCurrentValue(currentData?.count)

    const pageCount = useMemo(
        () => (currentCount ? Math.ceil(currentCount! / limit!) : 1),
        [isLoading, limit, currentCount]
    )

    // const { dataToRender } = useWebSocket({
    //     currentData: currentData?.results || [],
    //     endpoint: 'orders',
    //     refetch
    // })

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setCurrentQueryParams(queryParams as OrdersQueryParams))
    }, [overdue, completed, scheduled, search, flow, flow, ordering, category])

    return (
        <>
            <TableControls />
            <OrdersViewTable
                columns={columns}
                data={currentData?.results || []}
                isDataLoading={isLoading}
                isDataFetching={isFetching}
                pageCount={pageCount}
            />
        </>
    )
}
