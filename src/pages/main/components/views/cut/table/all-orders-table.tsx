import { useEffect, useMemo } from 'react'
import { NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { columns } from '../../all-orders-view/table/columns'
import { AllOrdersViewTable2 } from '../../all-orders-view/table/table2'

import { useCurrentValue, useWebSocket } from '@/hooks'
import { useGetOrdersQuery } from '@/store/api/ebms/ebms'

export const AllOrdersTable = () => {
    const [offsetParam] = useQueryParam('offset', NumberParam)
    const [limitParam] = useQueryParam('limit', NumberParam)
    const [ordering, setOrdering] = useQueryParam('ordering', StringParam)
    const [cutView] = useQueryParam('cut-view', StringParam)

    const { currentData, isLoading, isFetching, refetch } = useGetOrdersQuery({
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

    const { dataToRender } = useWebSocket({
        currentData: currentData?.results || [],
        endpoint: 'orders',
        refetch
    })

    useEffect(() => {
        return () => {
            setOrdering(null)
        }
    }, [cutView])

    return (
        <AllOrdersViewTable2
            data={dataToRender || []}
            isDataFetching={isFetching}
            isDataLoading={isLoading}
            pageCount={pageCount}
            columns={columns}
        />
    )
}
