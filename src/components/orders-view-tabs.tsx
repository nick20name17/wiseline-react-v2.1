'use client'

import { useQueryState } from 'nuqs'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { tableConfig } from '@/config/table'

const VIEW_CONFIG: Record<string, { ordering: string | null }> = {
    orders: { ordering: '-priority' },
    lines: { ordering: 'order' },
    cut: { ordering: null }
}

export const OrdersViewTabs = () => {
    const [view, setView] = useQueryState('view', {
        defaultValue: 'orders'
    })

    const [, setOffset] = useQueryState('offset', { parse: Number })
    const [, setLimit] = useQueryState('limit', { parse: Number })
    const [, setOrdering] = useQueryState('ordering')

    const handleViewChange = (newView: string) => {
        setView(newView)
        setOffset(0)
        setLimit(tableConfig.pagination.pageSize)
        setOrdering(VIEW_CONFIG[newView].ordering)
    }

    return (
        <Tabs
            onValueChange={handleViewChange}
            value={view}
        >
            <TabsList>
                <TabsTrigger value='orders'>All Orders</TabsTrigger>
                <TabsTrigger value='lines'>All Lines</TabsTrigger>
                <TabsTrigger value='cut'>Cut View</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
