import { useMemo } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

import { CutView } from './components/views/cut'
import { DetailsView } from './components/views/details'
import { OrdersView } from './components/views/orders'
import { useGetPrioritiesQuery } from '@/api/priorities/priorities'
import { OrdersHeader } from '@/components/orders-header'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { useMatchMedia } from '@/hooks/use-match-media'

export const MainPage = () => {
    const [view] = useQueryParam('view', StringParam)

    const { isTablet } = useMatchMedia()

    useBodyScrollLock(!isTablet)

    const {} = useGetPrioritiesQuery()

    const ordersView = useMemo(() => {
        switch (view) {
            case 'cut':
                return <CutView />
            case 'lines':
                return <DetailsView />
            default:
                return <OrdersView />
        }
    }, [view])

    return (
        <section className='px-4'>
            <OrdersHeader />
            {ordersView}
        </section>
    )
}
