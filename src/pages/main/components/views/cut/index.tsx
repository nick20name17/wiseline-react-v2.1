import { useMemo } from 'react'
import { BooleanParam, NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { Controls } from './controls'
import { AllOrdersTable } from './table/all-orders-table'
import { columns } from './table/columns'
import { CutViewTable } from './table/table'
import { useGetCuttingViewItemsQuery } from '@/api/ebms/cutting/cutting'
import { useCurrentValue } from '@/hooks/use-current-value'

export interface CuttingItemsToDisplay {
    total: number
    color: string
    size: number
    v2: number
    press_brake: number
    caps: number
    roll_former: number
    new_stage_2: number
    autoid: string
}

const defaultCutView = 'pipeline'

export const CutView = () => {
    const [cutView = defaultCutView] = useQueryParam('cut-view', StringParam)
    const [color] = useQueryParam('color', StringParam)
    const [offset] = useQueryParam('offset', NumberParam)
    const [limit] = useQueryParam('limit', NumberParam)
    const [cuttingComplete] = useQueryParam('cutting_complete', BooleanParam)

    const {
        currentData: cuttingItems,
        isLoading,
        isFetching
    } = useGetCuttingViewItemsQuery({
        color: color === 'all' ? '' : color,
        limit: limit!,
        offset: offset!,
        cutting_complete: cuttingComplete!
    })

    // const { dataToRender } = useCuttingItemsWebSocket({
    //     currentData: cuttingItems?.results || [],
    //     refetch
    // })

    const currentCount = useCurrentValue(cuttingItems?.count)

    const pageCount = useMemo(
        () => (currentCount ? Math.ceil(currentCount! / limit!) : 1),
        [isLoading, limit, currentCount]
    )

    return (
        <>
            <Controls />
            {cutView === 'pipeline' ? (
                <CutViewTable
                    key={color}
                    data={cuttingItems?.results || []}
                    isDataLoading={isLoading}
                    isDataFetching={isFetching}
                    columns={columns}
                    pageCount={pageCount}
                />
            ) : (
                <AllOrdersTable />
            )}
        </>
    )
}
