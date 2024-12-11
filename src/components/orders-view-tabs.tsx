'use client'

import { NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { tableConfig } from '@/config/table'

const VIEW_CONFIG: Record<string, { ordering: string | null }> = {
    orders: { ordering: '-priority' },
    lines: { ordering: 'order' },
    cut: { ordering: null }
}

const defaultView = 'orders'

export const OrdersViewTabs = () => {
    const [view = defaultView, setView] = useQueryParam('view', StringParam)

    const [, setOffset] = useQueryParam('offset', NumberParam)
    const [, setLimit] = useQueryParam('limit', NumberParam)
    const [, setOrdering] = useQueryParam('ordering')

    const handleViewChange = (newView: string) => {
        setView(newView)
        setOffset(0)
        setLimit(tableConfig.pagination.pageSize)
        setOrdering(VIEW_CONFIG[newView].ordering)
    }

    return (
        <Tabs
            onValueChange={handleViewChange}
            value={view || defaultView}
        >
            <TabsList>
                <TabsTrigger value='orders'>All Orders</TabsTrigger>
                <TabsTrigger value='lines'>All Lines</TabsTrigger>
                <TabsTrigger value='cut'>Cut View</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
