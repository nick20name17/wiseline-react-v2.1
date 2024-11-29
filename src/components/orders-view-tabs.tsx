import { useEffect } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { tableConfig } from '@/config/table'
import { useQueryState } from 'nuqs'

export const OrdersViewTabs = () => {
    const [view = 'orders', setView] = useQueryState('view')
    const [, setOffset] = useQueryState('offset', {
        parse: Number
    })
    const [, setLimit] = useQueryState('limit', {
        parse: Number
    })
    const [, setOrdering] = useQueryState('ordering')

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
