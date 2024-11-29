import { useEffect } from 'react'
import { NumberParam, StringParam, useQueryParam } from 'use-query-params'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { tableConfig } from '@/config/table'

export const OrdersViewTabs = () => {
    const [view = 'orders', setView] = useQueryParam('view', StringParam)
    const [, setOffset] = useQueryParam('offset', NumberParam)
    const [, setLimit] = useQueryParam('limit', NumberParam)
    const [, setOrdering] = useQueryParam('ordering', StringParam)

    useEffect(() => {
        setView(view || 'orders')
    }, [])

    const onValueChange = (value: string) => {
        setOffset(0)
        setLimit(tableConfig.pagination.pageSize)
        setView(value)

        if (value === 'lines') {
            setOrdering('order')
        } else if (value === 'orders') {
            setOrdering('-priority')
        } else {
            setOrdering(null)
        }
    }

    return (
        <Tabs
            onValueChange={onValueChange}
            defaultValue={view!}>
            <TabsList className='bg-secondary'>
                <TabsTrigger value='orders'>All Orders</TabsTrigger>
                <TabsTrigger value='lines'>All Lines</TabsTrigger>
                <TabsTrigger value='cut'>Cut View</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
