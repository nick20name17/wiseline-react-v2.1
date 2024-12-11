import { useQueryState } from 'nuqs'
import { useEffect, useMemo } from 'react'

import { columns } from '../../orders/table/columns'
import { OrdersViewTable } from '../../orders/table/table'

import { useGetOrdersQuery } from '@/api/ebms/ebms'
import { useCurrentValue } from '@/hooks/use-current-value'

export const AllOrdersTable = () => {
    const [offsetParam] = useQueryState('offset', {
        parse: Number
    })
    const [limitParam] = useQueryState('limit', {
        parse: Number
    })
    const [ordering, setOrdering] = useQueryState('ordering')
    const [cutView] = useQueryState('cut-view')

    const { currentData, isLoading, isFetching } = useGetOrdersQuery({
        limit: limitParam!,
        offset: offsetParam!,
        category: 'Trim',
        release_to_production: true,
        ordering: ordering!
    })

    const currentCount = useCurrentValue(currentData?.count)

    const pageCount = useMemo(
        () => (currentCount ? Math.ceil(currentCount! / limitParam!) : 1),
        [isLoading, limitParam, currentCount]
    )

    // const { dataToRender } = useWebSocket({
    //     currentData: currentData?.results || [],
    //     endpoint: 'orders',
    //     refetch
    // })

    useEffect(() => {
        return () => {
            setOrdering(null)
        }
    }, [cutView])

    return (
        <OrdersViewTable
            data={currentData?.results || []}
            isDataFetching={isFetching}
            isDataLoading={isLoading}
            pageCount={pageCount}
            columns={columns}
        />
    )
}
