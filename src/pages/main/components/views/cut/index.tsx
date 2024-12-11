import { useQueryState } from 'nuqs'
import { useMemo } from 'react'

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

export const CutView = () => {
    const [cutView] = useQueryState('cut-view')
    const [color] = useQueryState('color')
    const [offset] = useQueryState('offset', {
        parse: Number
    })
    const [limit] = useQueryState('limit', {
        parse: Number
    })
    const [cuttingComplete] = useQueryState('cutting_complete', {
        parse: Boolean
    })

    console.log(cutView)

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
